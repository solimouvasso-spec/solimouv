# Solimouv' — Présentation de la plateforme

## C'est quoi Solimouv' ?

**Solimouv'** est le festival du sport inclusif organisé par **Up Sport! Paris**. Il rassemble chaque année des associations, des sportifs et des curieux autour d'une conviction simple : le sport est un langage universel, accessible à tous, quels que soient les capacités ou le profil.

La plateforme web (PWA) est l'outil numérique officiel du festival. Elle accompagne les participants avant, pendant et après l'événement.

---

## La vision

> "Ici, le sport n'est pas une performance, c'est un espace de rencontre et une expérience à vivre sans barrière."

Solimouv' place l'inclusion au centre : chaque fonctionnalité de la plateforme est pensée pour que **tout le monde** puisse participer, découvrir et progresser — avec ou sans handicap, débutant ou pratiquant régulier.

---

## Le parcours utilisateur

La plateforme guide chaque participant en trois étapes :

### 1. Je découvre
Avant le festival, l'utilisateur consulte :
- le **programme** de la journée (activités, horaires, lieux),
- l'**annuaire des associations** partenaires (sports proposés, missions, contacts),
- les informations **À propos** d'Up Sport! Paris.

### 2. Je participe
Le jour J, au festival :
- L'utilisateur crée son **Soli'Passeport** numérique (profil personnel).
- Il **scanne les QR codes** des stands pour valider sa présence et gagner des points.
- Il débloque des **badges** selon les stands visités et les sports testés.
- Il peut comparer son score sur le **classement live**.

### 3. Je continue
Après le festival, tout au long de l'année :
- La plateforme **Soli'Skills** propose des **défis mensuels** pour maintenir une pratique sportive régulière.
- L'utilisateur cumule des points, monte dans le classement et gagne des récompenses.

---

## Les fonctionnalités

### Soli'Passeport
Le passeport numérique personnel du participant. Il contient :
- son profil (nom, sport préféré),
- l'historique de ses scans de stands,
- ses badges débloqués,
- son score total de points.

### Scan QR
Au festival, chaque stand est équipé d'un QR code unique. L'utilisateur ouvre la caméra depuis la page `/scan`, scanne le QR, et sa participation est enregistrée automatiquement en base de données. Impossible de scanner deux fois le même stand.

### Badges & gamification
Des badges sont attribués automatiquement selon les actions réalisées :

| Badge | Condition |
|---|---|
| Explorateur | Premier stand scanné |
| Découverte | Stand handisport visité |
| *(et d'autres)* | Selon les catégories visitées |

### Défis mensuels (Soli'Skills)
Chaque mois, l'admin publie un nouveau défi sportif. Les participants reçoivent des suggestions personnalisées selon leur sport préféré (yoga, natation, foot, etc.) et peuvent valider leur participation pour gagner des points.

### Classement
Un classement global met à jour les scores en temps réel (via Supabase Realtime). Les meilleures performances sont récompensées :
- 1er : Adhésion annuelle offerte + certification + goodies
- 2e : -50% sur l'adhésion + goodies
- 3e : -30% sur l'adhésion + goodies
- Top 10 : Certification Solimouv'

### Programme du festival
La page programme liste toutes les activités de la journée avec horaires, lieux et catégories, permettant à chaque participant de planifier sa visite.

### Annuaire des associations
Toutes les associations partenaires sont répertoriées avec leur mission, les sports qu'elles proposent et leurs informations de contact. Les utilisateurs peuvent découvrir et rejoindre des associations après le festival.

### Quiz sport inclusif
Un quiz interactif pour sensibiliser les participants aux différentes formes de sport adapté et inclusif, de façon ludique.

### Matching sportif
Un algorithme recommande des sports et activités adaptées au profil et aux préférences de l'utilisateur.

### Dons
Un espace dédié pour soutenir financièrement Up Sport! Paris et ses actions en faveur du sport inclusif.

### Administration
Un tableau de bord admin permet de gérer les stands, les défis, les associations et de suivre les statistiques de participation.

---

## Qui peut utiliser la plateforme ?

| Profil | Usage |
|---|---|
| Participant festival | Passeport, scan, badges, défis, classement |
| Curieux / visiteur | Programme, associations, quiz, accueil |
| Association partenaire | Visibilité dans l'annuaire |
| Donateur | Page dons |
| Administrateur | Gestion complète via le dashboard |

---

## Accessibilité & inclusion

La plateforme est conçue avec l'accessibilité en tête :
- Navigation clavier complète (`tabIndex`, `aria-label` sur tous les éléments interactifs).
- Contrastes élevés (fond violet foncé `#5f2482`, texte blanc).
- Compatible avec les lecteurs d'écran.
- Interface mobile-first, utilisable sur tout smartphone sans installation (PWA).
- Mode hors-ligne : les pages essentielles restent accessibles sans connexion.

---

## La plateforme en chiffres (édition 2026)

| Indicateur | Objectif |
|---|---|
| Date du festival | 14 juin 2026 |
| Lieu | Paris |
| Activités proposées | 20+ |
| Associations partenaires | 30+ |
| Accès | Libre et gratuit |

---

## Technologie

La plateforme est une **Progressive Web App (PWA)** : elle s'installe directement depuis le navigateur sur mobile, fonctionne partiellement hors-ligne et offre une expérience proche d'une application native — sans passer par l'App Store ou Google Play.

Elle est construite avec **Next.js**, **Supabase** et déployée sur **Vercel**, garantissant performance, fiabilité et temps de chargement optimisés.

---

## Contact & liens

- Site : [solimouv.com](https://solimouv.com)
- Instagram : [@solimouv](https://www.instagram.com/solimouv/)
- LinkedIn : [Solimouv](https://www.linkedin.com/company/solimouv/)
- TikTok : [@solimouv](https://www.tiktok.com/@solimouv)
- Contact : via la page `/contact` de la plateforme

---

*Fait avec passion pour le sport inclusif — Up Sport! Paris © 2026*
