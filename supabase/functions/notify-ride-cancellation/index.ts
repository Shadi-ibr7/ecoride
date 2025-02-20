
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ride_id } = await req.json();
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Récupérer les informations du trajet et des passagers
    const { data: rideData, error: rideError } = await supabase
      .from("rides")
      .select(`
        *,
        driver:driver_id(email),
        ride_bookings(
          passenger:passenger_id(email)
        )
      `)
      .eq("id", ride_id)
      .single();

    if (rideError) throw rideError;
    if (!rideData) throw new Error("Ride not found");

    // Envoyer un email à chaque passager
    const emailPromises = rideData.ride_bookings.map(async (booking) => {
      await resend.emails.send({
        from: "Covoiturage <onboarding@resend.dev>",
        to: [booking.passenger.email],
        subject: "Annulation de votre covoiturage",
        html: `
          <h1>Votre covoiturage a été annulé</h1>
          <p>Le trajet ${rideData.departure_address} → ${rideData.arrival_address} prévu le ${new Date(rideData.departure_time).toLocaleDateString('fr-FR')} a été annulé.</p>
          <p>Vos crédits ont été remboursés automatiquement.</p>
        `,
      });
    });

    await Promise.all(emailPromises);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in notify-ride-cancellation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
