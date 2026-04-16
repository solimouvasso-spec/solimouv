import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mon sport — Matching sportif",
    description:
      "Trouvez l'activité sportive adaptée à votre profil grâce à notre algorithme de matching propulsé par WebAssembly.",
  };
}

export default function MatchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <header className="text-center mb-12">
        <p className="text-teal text-sm font-semibold uppercase tracking-widest mb-3">
          Algorithme Wasm
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Trouver mon sport
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Répondez à quelques questions et notre algorithme de matching — compilé
          en WebAssembly pour une rapidité maximale — vous suggère l&apos;activité
          idéale.
        </p>
      </header>

      {/* Formulaire de matching */}
      <section aria-labelledby="match-form-heading">
        <h2 id="match-form-heading" className="sr-only">
          Formulaire de matching sportif
        </h2>
        <form
          className="space-y-6 bg-navy-light rounded-2xl p-6 sm:p-8 border border-teal/20"
          aria-label="Formulaire de matching sportif"
          noValidate
        >
          {/* Situation */}
          <fieldset>
            <legend className="text-white font-semibold mb-3">
              Votre situation
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="group">
              {[
                "Aucun handicap",
                "Déficience motrice",
                "Déficience visuelle",
                "Déficience auditive",
                "Déficience cognitive",
                "Autre",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-teal/20 hover:border-teal/50 transition-colors has-[:checked]:border-teal has-[:checked]:bg-teal/10"
                >
                  <input
                    type="radio"
                    name="situation"
                    value={option}
                    className="accent-teal sr-only"
                    aria-label={option}
                  />
                  <span className="text-gray-300 text-sm">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Niveau */}
          <div>
            <label
              htmlFor="match-level"
              className="block text-white font-semibold mb-3"
            >
              Niveau sportif
            </label>
            <select
              id="match-level"
              name="level"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            >
              <option value="">Sélectionner...</option>
              <option value="debutant">Débutant — je n&apos;ai jamais pratiqué</option>
              <option value="intermediaire">Intermédiaire — je pratique parfois</option>
              <option value="confirme">Confirmé — je pratique régulièrement</option>
              <option value="expert">Expert — je suis en compétition</option>
            </select>
          </div>

          {/* Préférences */}
          <fieldset>
            <legend className="text-white font-semibold mb-3">
              Vos préférences
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { value: "collectif", label: "Sport collectif" },
                { value: "individuel", label: "Sport individuel" },
                { value: "contact", label: "Contact physique" },
                { value: "water", label: "Activité aquatique" },
                { value: "outdoor", label: "En plein air" },
                { value: "indoor", label: "En salle" },
                { value: "calme", label: "Calme et précision" },
                { value: "intensite", label: "Haute intensité" },
                { value: "bienetre", label: "Bien-être" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-teal/20 hover:border-teal/50 transition-colors has-[:checked]:border-teal has-[:checked]:bg-teal/10"
                >
                  <input
                    type="checkbox"
                    name="preferences"
                    value={value}
                    className="accent-teal rounded"
                    aria-label={label}
                  />
                  <span className="text-gray-300 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Âge */}
          <div>
            <label
              htmlFor="match-age"
              className="block text-white font-semibold mb-3"
            >
              Votre tranche d&apos;âge
            </label>
            <select
              id="match-age"
              name="age"
              className="w-full bg-navy-dark border border-teal/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            >
              <option value="">Sélectionner...</option>
              <option value="enfant">Enfant (moins de 12 ans)</option>
              <option value="ado">Adolescent (12–17 ans)</option>
              <option value="adulte">Adulte (18–59 ans)</option>
              <option value="senior">Senior (60 ans et plus)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-accent text-white font-bold text-lg rounded-full hover:bg-accent/90 transition-colors"
            aria-label="Lancer l'algorithme de matching sportif"
          >
            Trouver mon activité
          </button>
        </form>
      </section>

      {/* Note technique */}
      <aside
        className="mt-8 p-4 rounded-xl border border-teal/20 bg-teal/5 text-sm text-gray-400"
        aria-label="Information technique"
      >
        <p>
          <strong className="text-teal">⚡ Propulsé par WebAssembly</strong> —
          L&apos;algorithme de matching est écrit en Rust et compilé en Wasm
          pour s&apos;exécuter instantanément dans votre navigateur. Aucune
          donnée n&apos;est envoyée à un serveur.
        </p>
      </aside>
    </div>
  );
}
