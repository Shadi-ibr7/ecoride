
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rideId } = await req.json();

    // Récupérer les informations du trajet
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .select(`
        *,
        driver:profiles!rides_driver_id_fkey(full_name),
        vehicle:vehicles(*),
        bookings:ride_bookings(
          passenger:profiles(
            email:auth_users(email)
          )
        )
      `)
      .eq('id', rideId)
      .single();

    if (rideError) throw rideError;

    // Envoyer un email à chaque passager
    const emailPromises = ride.bookings
      .filter((booking: any) => booking.passenger?.email?.auth_users?.[0]?.email)
      .map((booking: any) => {
        const passengerEmail = booking.passenger.email.auth_users[0].email;
        
        return resend.emails.send({
          from: "EcoRide <no-reply@resend.dev>",
          to: [passengerEmail],
          subject: "Validation de votre trajet",
          html: `
            <h1>Votre trajet est terminé</h1>
            <p>Bonjour,</p>
            <p>Votre trajet avec ${ride.driver.full_name} est maintenant terminé.</p>
            <p>Merci de vous connecter à votre espace pour valider que tout s'est bien passé et laisser un avis sur votre expérience.</p>
            <p>Trajet :</p>
            <ul>
              <li>Départ : ${ride.departure_address}</li>
              <li>Arrivée : ${ride.arrival_address}</li>
              <li>Date : ${new Date(ride.departure_time).toLocaleDateString('fr-FR')}</li>
            </ul>
            <p>À bientôt sur EcoRide !</p>
          `
        });
      });

    await Promise.all(emailPromises);
    
    console.log(`Emails de fin de trajet envoyés pour le trajet ${rideId}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});
