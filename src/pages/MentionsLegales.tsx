
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-[#1B4332] mb-8">
            Mentions Légales
          </h1>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Objet du site</h2>
            <p className="text-gray-600">
              Ce site présente un projet réalisé dans le cadre de ma formation à Studi. Il a pour vocation d'explorer et de mettre en pratique des concepts étudiés durant ce cursus, sans intention commerciale ni professionnelle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Responsabilité</h2>
            <p className="text-gray-600">
              Les informations et contenus présents sur ce site sont fournis à titre pédagogique. Bien que nous nous efforçons d'assurer l'exactitude des informations, aucune garantie n'est donnée quant à leur exhaustivité ou à leur actualisation. L'utilisation de ce site se fait sous votre entière responsabilité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Propriété intellectuelle</h2>
            <p className="text-gray-600">
              L'ensemble des contenus (textes, images, logos, etc.) est protégé par les droits de propriété intellectuelle. Toute reproduction ou utilisation, même partielle, de ces éléments est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Données personnelles</h2>
            <p className="text-gray-600">
              Ce projet n'a pas vocation à collecter des données personnelles à des fins commerciales. En cas de collecte, les informations recueillies seront utilisées uniquement dans le cadre strictement académique de la formation, conformément aux dispositions légales en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant les mentions légales ou le projet, veuillez nous contacter à l'adresse suivante : <a href="mailto:ishadi799@gmail.com" className="text-primary-600 hover:underline">ishadi799@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Cadre de la formation</h2>
            <p className="text-gray-600">
              Ce projet a été développé dans le cadre de ma formation à Studi. Il reflète une démarche pédagogique visant à appliquer les connaissances acquises durant ce cursus et ne constitue pas une activité professionnelle ou commerciale.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;
