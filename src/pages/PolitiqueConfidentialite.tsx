
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="font-playfair text-3xl md:text-4xl text-[#1B4332] mb-8">
            Politique de Confidentialité
          </h1>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Introduction</h2>
            <p className="text-gray-600">
              Ce site présente un projet réalisé dans le cadre de ma formation à Studi. La présente Politique de Confidentialité a pour but d'informer les utilisateurs sur la manière dont leurs données personnelles sont collectées, utilisées et protégées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Collecte de données personnelles</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>
                <strong>Formulaires et inscriptions :</strong> Le site peut collecter des informations personnelles (nom, adresse email, etc.) lorsque l'utilisateur remplit un formulaire ou s'inscrit à une newsletter.
              </li>
              <li>
                <strong>Données de navigation :</strong> Des cookies et autres technologies similaires peuvent être utilisés pour analyser la fréquentation du site et améliorer l'expérience utilisateur.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Utilisation des données</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Les données collectées sont utilisées exclusivement à des fins pédagogiques et pour faciliter les échanges relatifs au projet.</li>
              <li>Aucune information personnelle ne sera vendue, partagée ou utilisée à des fins commerciales ou publicitaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Cookies et technologies similaires</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Le site utilise des cookies pour optimiser la navigation et analyser le trafic.</li>
              <li>L'utilisateur peut configurer ou désactiver les cookies via les paramètres de son navigateur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Sécurité des données</h2>
            <p className="text-gray-600">
              Des mesures techniques et organisationnelles sont mises en place pour protéger les données personnelles contre tout accès non autorisé ou toute divulgation accidentelle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Droits de l'utilisateur</h2>
            <p className="text-gray-600">
              Conformément à la réglementation en vigueur, l'utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition concernant ses données personnelles.<br/>
              Pour exercer ces droits, l'utilisateur peut nous contacter par le biais des informations indiquées dans la section suivante.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Contact</h2>
            <p className="text-gray-600">
              Pour toute question relative à cette Politique de Confidentialité ou pour exercer vos droits, veuillez nous contacter à l'adresse suivante : <a href="mailto:ishadi799@gmail.com" className="text-primary-600 hover:underline">ishadi799@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1B4332] mb-3">Modifications de la Politique de Confidentialité</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>La présente politique peut être mise à jour périodiquement afin de refléter les évolutions législatives ou les pratiques du site.</li>
              <li>Les utilisateurs seront informés des changements significatifs via une mise à jour sur cette page.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
