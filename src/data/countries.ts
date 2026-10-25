// Scope: 193 UN member states plus the two UN observer states (Palestine and Vatican City).
// Country metadata adapted from https://github.com/mledoze/countries (ODbL 1.0).
// Continents follow the source's geographical grouping; transcontinental countries appear once.
// Flag descriptions are learning cues, not statements about diplomatic recognition.
export type Continent =
  "Africa" | "Asia" | "Europe" | "North America" | "South America" | "Oceania";

export interface Country {
  code: string;
  name: string;
  continent: Continent;
  capital: string;
  flagHint: string;
}

export const countries: Country[] = [
  {
    code: "af",
    name: "Afghanistan",
    continent: "Asia",
    capital: "Kabul",
    flagHint:
      "Black, red and green vertical bands surround a white emblem. This is the republic-era flag; the de facto authorities use a white flag.",
  },
  {
    code: "al",
    name: "Albania",
    continent: "Europe",
    capital: "Tirana",
    flagHint: "Look for the black double-headed eagle on a red field.",
  },
  {
    code: "dz",
    name: "Algeria",
    continent: "Africa",
    capital: "Algiers",
    flagHint:
      "A red crescent and star sit across green and white vertical halves.",
  },
  {
    code: "ad",
    name: "Andorra",
    continent: "Europe",
    capital: "Andorra la Vella",
    flagHint:
      "Blue, yellow and red vertical bands surround a detailed coat of arms.",
  },
  {
    code: "ao",
    name: "Angola",
    continent: "Africa",
    capital: "Luanda",
    flagHint:
      "A yellow half-gear, machete and star cross the red and black halves.",
  },
  {
    code: "ag",
    name: "Antigua and Barbuda",
    continent: "North America",
    capital: "Saint John's",
    flagHint: "A rising yellow sun appears above a blue sea inside a red V.",
  },
  {
    code: "ar",
    name: "Argentina",
    continent: "South America",
    capital: "Buenos Aires",
    flagHint:
      "Three sky-blue, white and sky-blue bands surround the Sun of May.",
  },
  {
    code: "am",
    name: "Armenia",
    continent: "Asia",
    capital: "Yerevan",
    flagHint: "Three horizontal bands: red above blue above orange.",
  },
  {
    code: "au",
    name: "Australia",
    continent: "Oceania",
    capital: "Canberra",
    flagHint:
      "A Union Jack, a large Commonwealth Star and the Southern Cross sit on blue.",
  },
  {
    code: "at",
    name: "Austria",
    continent: "Europe",
    capital: "Vienna",
    flagHint: "Three equal horizontal bands: red, white, red.",
  },
  {
    code: "az",
    name: "Azerbaijan",
    continent: "Asia",
    capital: "Baku",
    flagHint:
      "Blue, red and green bands frame a white crescent and eight-pointed star.",
  },
  {
    code: "bs",
    name: "Bahamas",
    continent: "North America",
    capital: "Nassau",
    flagHint:
      "A black triangle points into aquamarine, yellow and aquamarine bands.",
  },
  {
    code: "bh",
    name: "Bahrain",
    continent: "Asia",
    capital: "Manama",
    flagHint: "Five white teeth separate the white hoist from the red field.",
  },
  {
    code: "bd",
    name: "Bangladesh",
    continent: "Asia",
    capital: "Dhaka",
    flagHint: "A red disc, slightly toward the hoist, sits on dark green.",
  },
  {
    code: "bb",
    name: "Barbados",
    continent: "North America",
    capital: "Bridgetown",
    flagHint:
      "A broken black trident stands in the gold stripe between two blue stripes.",
  },
  {
    code: "by",
    name: "Belarus",
    continent: "Europe",
    capital: "Minsk",
    flagHint:
      "Red above green, with a traditional red-and-white ornament at the hoist.",
  },
  {
    code: "be",
    name: "Belgium",
    continent: "Europe",
    capital: "Brussels",
    flagHint: "Three vertical bands: black, yellow, red.",
  },
  {
    code: "bz",
    name: "Belize",
    continent: "North America",
    capital: "Belmopan",
    flagHint:
      "A coat of arms with two people sits on blue, bordered by thin red bands.",
  },
  {
    code: "bj",
    name: "Benin",
    continent: "Africa",
    capital: "Porto-Novo",
    flagHint: "A green vertical band meets yellow above red.",
  },
  {
    code: "bt",
    name: "Bhutan",
    continent: "Asia",
    capital: "Thimphu",
    flagHint: "A white dragon crosses diagonal yellow and orange halves.",
  },
  {
    code: "bo",
    name: "Bolivia",
    continent: "South America",
    capital: "Sucre",
    flagHint:
      "Red, yellow and green horizontal bands; the state flag adds a coat of arms.",
  },
  {
    code: "ba",
    name: "Bosnia and Herzegovina",
    continent: "Europe",
    capital: "Sarajevo",
    flagHint:
      "A yellow triangle and a diagonal row of white stars stand on blue.",
  },
  {
    code: "bw",
    name: "Botswana",
    continent: "Africa",
    capital: "Gaborone",
    flagHint: "A white-edged black stripe runs horizontally across pale blue.",
  },
  {
    code: "br",
    name: "Brazil",
    continent: "South America",
    capital: "Brasília",
    flagHint: "A yellow diamond holds a blue starry globe on a green field.",
  },
  {
    code: "bn",
    name: "Brunei",
    continent: "Asia",
    capital: "Bandar Seri Begawan",
    flagHint:
      "A red crest lies over diagonal white and black stripes on yellow.",
  },
  {
    code: "bg",
    name: "Bulgaria",
    continent: "Europe",
    capital: "Sofia",
    flagHint: "Three horizontal bands: white, green, red.",
  },
  {
    code: "bf",
    name: "Burkina Faso",
    continent: "Africa",
    capital: "Ouagadougou",
    flagHint:
      "A yellow star marks the middle of red and green horizontal halves.",
  },
  {
    code: "bi",
    name: "Burundi",
    continent: "Africa",
    capital: "Gitega",
    flagHint:
      "A white diagonal cross divides red and green sections around three red stars.",
  },
  {
    code: "cv",
    name: "Cabo Verde",
    continent: "Africa",
    capital: "Praia",
    flagHint:
      "Ten yellow stars form a circle over narrow white-red-white stripes on blue.",
  },
  {
    code: "kh",
    name: "Cambodia",
    continent: "Asia",
    capital: "Phnom Penh",
    flagHint:
      "White Angkor Wat stands on the wide red band between blue bands.",
  },
  {
    code: "cm",
    name: "Cameroon",
    continent: "Africa",
    capital: "Yaoundé",
    flagHint: "A yellow star sits in the red stripe between green and yellow.",
  },
  {
    code: "ca",
    name: "Canada",
    continent: "North America",
    capital: "Ottawa",
    flagHint: "A red maple leaf stands in white between two red bands.",
  },
  {
    code: "cf",
    name: "Central African Republic",
    continent: "Africa",
    capital: "Bangui",
    flagHint:
      "Blue, white, green and yellow bands are crossed by one vertical red stripe.",
  },
  {
    code: "td",
    name: "Chad",
    continent: "Africa",
    capital: "N'Djamena",
    flagHint:
      "Blue, yellow and red vertical stripes; the blue is darker than Romania's.",
  },
  {
    code: "cl",
    name: "Chile",
    continent: "South America",
    capital: "Santiago",
    flagHint: "A white star sits in a blue square above the red lower half.",
  },
  {
    code: "cn",
    name: "China",
    continent: "Asia",
    capital: "Beijing",
    flagHint: "One large yellow star and four smaller stars appear on red.",
  },
  {
    code: "co",
    name: "Colombia",
    continent: "South America",
    capital: "Bogotá",
    flagHint:
      "Yellow takes the top half, with smaller blue and red bands below.",
  },
  {
    code: "km",
    name: "Comoros",
    continent: "Africa",
    capital: "Moroni",
    flagHint:
      "Four stars and a crescent sit in a green triangle beside four colored bands.",
  },
  {
    code: "cr",
    name: "Costa Rica",
    continent: "North America",
    capital: "San José",
    flagHint: "The wide red center band lies between white and blue bands.",
  },
  {
    code: "hr",
    name: "Croatia",
    continent: "Europe",
    capital: "Zagreb",
    flagHint:
      "A red-and-white checkerboard shield sits over red, white and blue bands.",
  },
  {
    code: "cu",
    name: "Cuba",
    continent: "North America",
    capital: "Havana",
    flagHint:
      "A white star in a red triangle points into alternating blue and white stripes.",
  },
  {
    code: "cy",
    name: "Cyprus",
    continent: "Europe",
    capital: "Nicosia",
    flagHint:
      "A copper-colored island silhouette and olive branches sit on white.",
  },
  {
    code: "cz",
    name: "Czechia",
    continent: "Europe",
    capital: "Prague",
    flagHint: "A blue triangle points into white above red.",
  },
  {
    code: "cd",
    name: "Democratic Republic of the Congo",
    continent: "Africa",
    capital: "Kinshasa",
    flagHint:
      "A red diagonal stripe with yellow borders crosses sky blue beneath a yellow star.",
  },
  {
    code: "dk",
    name: "Denmark",
    continent: "Europe",
    capital: "Copenhagen",
    flagHint: "A white Nordic cross stretches across a red field.",
  },
  {
    code: "dj",
    name: "Djibouti",
    continent: "Africa",
    capital: "Djibouti",
    flagHint:
      "A white triangle with a red star points into sky blue above green.",
  },
  {
    code: "dm",
    name: "Dominica",
    continent: "North America",
    capital: "Roseau",
    flagHint:
      "A purple Sisserou parrot sits among ten green stars on a red disc.",
  },
  {
    code: "do",
    name: "Dominican Republic",
    continent: "North America",
    capital: "Santo Domingo",
    flagHint:
      "A white cross separates red and blue quarters around a central coat of arms.",
  },
  {
    code: "ec",
    name: "Ecuador",
    continent: "South America",
    capital: "Quito",
    flagHint:
      "A wide yellow band sits above blue and red, with a central coat of arms.",
  },
  {
    code: "eg",
    name: "Egypt",
    continent: "Africa",
    capital: "Cairo",
    flagHint: "A golden eagle sits in the white band between red and black.",
  },
  {
    code: "sv",
    name: "El Salvador",
    continent: "North America",
    capital: "San Salvador",
    flagHint: "Blue-white-blue bands surround a triangular coat of arms.",
  },
  {
    code: "gq",
    name: "Equatorial Guinea",
    continent: "Africa",
    capital: "Ciudad de la Paz",
    flagHint:
      "A blue triangle meets green, white and red bands, with a silk-cotton tree crest.",
  },
  {
    code: "er",
    name: "Eritrea",
    continent: "Africa",
    capital: "Asmara",
    flagHint:
      "A red triangle holds a golden wreath between green and blue triangles.",
  },
  {
    code: "ee",
    name: "Estonia",
    continent: "Europe",
    capital: "Tallinn",
    flagHint: "Three horizontal bands: blue, black, white.",
  },
  {
    code: "sz",
    name: "Eswatini",
    continent: "Africa",
    capital: "Mbabane / Lobamba",
    flagHint:
      "A black-and-white shield and spears sit on a red band edged in yellow and blue.",
  },
  {
    code: "et",
    name: "Ethiopia",
    continent: "Africa",
    capital: "Addis Ababa",
    flagHint:
      "A yellow star in a blue disc sits on green, yellow and red bands.",
  },
  {
    code: "fj",
    name: "Fiji",
    continent: "Oceania",
    capital: "Suva",
    flagHint: "A Union Jack and shield sit on a light-blue field.",
  },
  {
    code: "fi",
    name: "Finland",
    continent: "Europe",
    capital: "Helsinki",
    flagHint: "A blue Nordic cross stretches across white.",
  },
  {
    code: "fr",
    name: "France",
    continent: "Europe",
    capital: "Paris",
    flagHint: "Three vertical bands: blue, white, red.",
  },
  {
    code: "ga",
    name: "Gabon",
    continent: "Africa",
    capital: "Libreville",
    flagHint: "Three horizontal bands: green, yellow, blue.",
  },
  {
    code: "gm",
    name: "Gambia",
    continent: "Africa",
    capital: "Banjul",
    flagHint:
      "Red, blue and green horizontal bands are separated by narrow white stripes.",
  },
  {
    code: "ge",
    name: "Georgia",
    continent: "Asia",
    capital: "Tbilisi",
    flagHint: "One large red cross and four small red crosses appear on white.",
  },
  {
    code: "de",
    name: "Germany",
    continent: "Europe",
    capital: "Berlin",
    flagHint: "Three horizontal bands: black, red, gold.",
  },
  {
    code: "gh",
    name: "Ghana",
    continent: "Africa",
    capital: "Accra",
    flagHint: "A black star sits in the yellow band between red and green.",
  },
  {
    code: "gr",
    name: "Greece",
    continent: "Europe",
    capital: "Athens",
    flagHint:
      "Nine blue-and-white stripes accompany a white cross in a blue canton.",
  },
  {
    code: "gd",
    name: "Grenada",
    continent: "North America",
    capital: "St. George's",
    flagHint:
      "A red border with six stars surrounds green and yellow triangles and a nutmeg.",
  },
  {
    code: "gt",
    name: "Guatemala",
    continent: "North America",
    capital: "Guatemala City",
    flagHint:
      "A quetzal bird and scroll sit between two vertical sky-blue bands.",
  },
  {
    code: "gn",
    name: "Guinea",
    continent: "Africa",
    capital: "Conakry",
    flagHint: "Three vertical bands: red, yellow, green.",
  },
  {
    code: "gw",
    name: "Guinea-Bissau",
    continent: "Africa",
    capital: "Bissau",
    flagHint:
      "A black star sits in a red vertical band beside yellow above green.",
  },
  {
    code: "gy",
    name: "Guyana",
    continent: "South America",
    capital: "Georgetown",
    flagHint:
      "A black-edged red triangle overlays a white-edged golden arrow on green.",
  },
  {
    code: "ht",
    name: "Haiti",
    continent: "North America",
    capital: "Port-au-Prince",
    flagHint:
      "A coat of arms on a white panel sits on blue and red horizontal halves.",
  },
  {
    code: "hn",
    name: "Honduras",
    continent: "North America",
    capital: "Tegucigalpa",
    flagHint: "Five blue stars sit in the white band between two blue bands.",
  },
  {
    code: "hu",
    name: "Hungary",
    continent: "Europe",
    capital: "Budapest",
    flagHint: "Three horizontal bands: red, white, green.",
  },
  {
    code: "is",
    name: "Iceland",
    continent: "Europe",
    capital: "Reykjavik",
    flagHint: "A white-edged red Nordic cross stretches across blue.",
  },
  {
    code: "in",
    name: "India",
    continent: "Asia",
    capital: "New Delhi",
    flagHint:
      "A navy-blue 24-spoke wheel sits between saffron and green bands.",
  },
  {
    code: "id",
    name: "Indonesia",
    continent: "Asia",
    capital: "Jakarta",
    flagHint:
      "Two equal horizontal bands: red above white. The proportions differ from Monaco's.",
  },
  {
    code: "ir",
    name: "Iran",
    continent: "Asia",
    capital: "Tehran",
    flagHint:
      "Green, white and red bands carry a red emblem and repeated border calligraphy.",
  },
  {
    code: "iq",
    name: "Iraq",
    continent: "Asia",
    capital: "Baghdad",
    flagHint:
      "Green Arabic calligraphy sits in the white band between red and black.",
  },
  {
    code: "ie",
    name: "Ireland",
    continent: "Europe",
    capital: "Dublin",
    flagHint: "Three vertical bands: green, white, orange.",
  },
  {
    code: "il",
    name: "Israel",
    continent: "Asia",
    capital: "Jerusalem",
    flagHint:
      "A blue Star of David sits between two blue horizontal stripes on white.",
  },
  {
    code: "it",
    name: "Italy",
    continent: "Europe",
    capital: "Rome",
    flagHint: "Three vertical bands: green, white, red.",
  },
  {
    code: "ci",
    name: "Ivory Coast",
    continent: "Africa",
    capital: "Yamoussoukro",
    flagHint:
      "Three vertical bands: orange, white, green. Reverse Ireland's colors.",
  },
  {
    code: "jm",
    name: "Jamaica",
    continent: "North America",
    capital: "Kingston",
    flagHint:
      "A gold diagonal cross divides green top and bottom from black sides.",
  },
  {
    code: "jp",
    name: "Japan",
    continent: "Asia",
    capital: "Tokyo",
    flagHint: "A red disc sits in the middle of a white field.",
  },
  {
    code: "jo",
    name: "Jordan",
    continent: "Asia",
    capital: "Amman",
    flagHint:
      "A white seven-pointed star sits in a red triangle beside black, white and green bands.",
  },
  {
    code: "kz",
    name: "Kazakhstan",
    continent: "Asia",
    capital: "Astana",
    flagHint:
      "A golden sun and soaring eagle sit on sky blue, beside a decorative gold band.",
  },
  {
    code: "ke",
    name: "Kenya",
    continent: "Africa",
    capital: "Nairobi",
    flagHint:
      "A Maasai shield and spears sit over black, red and green bands with white edges.",
  },
  {
    code: "ki",
    name: "Kiribati",
    continent: "Oceania",
    capital: "South Tarawa",
    flagHint:
      "A frigatebird flies over a rising sun and blue-and-white ocean waves.",
  },
  {
    code: "kw",
    name: "Kuwait",
    continent: "Asia",
    capital: "Kuwait City",
    flagHint: "A black trapezoid meets green, white and red horizontal bands.",
  },
  {
    code: "kg",
    name: "Kyrgyzstan",
    continent: "Asia",
    capital: "Bishkek",
    flagHint: "A yellow sun with a yurt-roof pattern sits on red.",
  },
  {
    code: "la",
    name: "Laos",
    continent: "Asia",
    capital: "Vientiane",
    flagHint:
      "A white disc sits in the wide blue stripe between two red stripes.",
  },
  {
    code: "lv",
    name: "Latvia",
    continent: "Europe",
    capital: "Riga",
    flagHint: "Dark carmine bands surround a narrow white horizontal stripe.",
  },
  {
    code: "lb",
    name: "Lebanon",
    continent: "Asia",
    capital: "Beirut",
    flagHint: "A green cedar tree stands in white between two red bands.",
  },
  {
    code: "ls",
    name: "Lesotho",
    continent: "Africa",
    capital: "Maseru",
    flagHint:
      "A black Basotho hat sits in the white band between blue and green.",
  },
  {
    code: "lr",
    name: "Liberia",
    continent: "Africa",
    capital: "Monrovia",
    flagHint:
      "One white star in a blue canton sits beside eleven red-and-white stripes.",
  },
  {
    code: "ly",
    name: "Libya",
    continent: "Africa",
    capital: "Tripoli",
    flagHint:
      "A white crescent and star sit in a wide black band between red and green.",
  },
  {
    code: "li",
    name: "Liechtenstein",
    continent: "Europe",
    capital: "Vaduz",
    flagHint: "A gold crown appears in the blue upper half, above red.",
  },
  {
    code: "lt",
    name: "Lithuania",
    continent: "Europe",
    capital: "Vilnius",
    flagHint: "Three horizontal bands: yellow, green, red.",
  },
  {
    code: "lu",
    name: "Luxembourg",
    continent: "Europe",
    capital: "Luxembourg",
    flagHint:
      "Red, white and light-blue horizontal bands; the blue is lighter than the Netherlands'.",
  },
  {
    code: "mg",
    name: "Madagascar",
    continent: "Africa",
    capital: "Antananarivo",
    flagHint: "A white vertical band meets red above green.",
  },
  {
    code: "mw",
    name: "Malawi",
    continent: "Africa",
    capital: "Lilongwe",
    flagHint: "A red rising sun appears in the black band above red and green.",
  },
  {
    code: "my",
    name: "Malaysia",
    continent: "Asia",
    capital: "Kuala Lumpur",
    flagHint:
      "A yellow crescent and fourteen-pointed star sit beside fourteen red-and-white stripes.",
  },
  {
    code: "mv",
    name: "Maldives",
    continent: "Asia",
    capital: "Malé",
    flagHint: "A white crescent sits in a green rectangle framed by red.",
  },
  {
    code: "ml",
    name: "Mali",
    continent: "Africa",
    capital: "Bamako",
    flagHint: "Three vertical bands: green, yellow, red.",
  },
  {
    code: "mt",
    name: "Malta",
    continent: "Europe",
    capital: "Valletta",
    flagHint: "A small George Cross sits in the white half, beside red.",
  },
  {
    code: "mh",
    name: "Marshall Islands",
    continent: "Oceania",
    capital: "Majuro",
    flagHint:
      "Orange and white diagonal rays rise across blue beneath a white star.",
  },
  {
    code: "mr",
    name: "Mauritania",
    continent: "Africa",
    capital: "Nouakchott",
    flagHint:
      "A golden crescent and star sit on green between red horizontal borders.",
  },
  {
    code: "mu",
    name: "Mauritius",
    continent: "Africa",
    capital: "Port Louis",
    flagHint: "Four horizontal bands: red, blue, yellow, green.",
  },
  {
    code: "mx",
    name: "Mexico",
    continent: "North America",
    capital: "Mexico City",
    flagHint:
      "An eagle with a snake stands on a cactus between green and red bands.",
  },
  {
    code: "fm",
    name: "Micronesia",
    continent: "Oceania",
    capital: "Palikir",
    flagHint: "Four white stars form a diamond on a light-blue field.",
  },
  {
    code: "md",
    name: "Moldova",
    continent: "Europe",
    capital: "Chișinău",
    flagHint: "A coat of arms sits in the yellow stripe between blue and red.",
  },
  {
    code: "mc",
    name: "Monaco",
    continent: "Europe",
    capital: "Monaco",
    flagHint:
      "Two equal horizontal bands: red above white. The flag is squarer than Indonesia's.",
  },
  {
    code: "mn",
    name: "Mongolia",
    continent: "Asia",
    capital: "Ulan Bator",
    flagHint: "A gold Soyombo symbol sits on the red band beside blue and red.",
  },
  {
    code: "me",
    name: "Montenegro",
    continent: "Europe",
    capital: "Podgorica",
    flagHint: "A gold double-headed eagle sits on red inside a gold border.",
  },
  {
    code: "ma",
    name: "Morocco",
    continent: "Africa",
    capital: "Rabat",
    flagHint: "A green five-pointed interlaced star sits on red.",
  },
  {
    code: "mz",
    name: "Mozambique",
    continent: "Africa",
    capital: "Maputo",
    flagHint:
      "A rifle, hoe and book sit in a red triangle beside green, black and yellow bands.",
  },
  {
    code: "mm",
    name: "Myanmar",
    continent: "Asia",
    capital: "Naypyidaw",
    flagHint:
      "A large white star spans yellow, green and red horizontal bands.",
  },
  {
    code: "na",
    name: "Namibia",
    continent: "Africa",
    capital: "Windhoek",
    flagHint:
      "A white-edged red diagonal divides blue and green, with a gold sun in blue.",
  },
  {
    code: "nr",
    name: "Nauru",
    continent: "Oceania",
    capital: "Yaren (de facto)",
    flagHint:
      "A white twelve-pointed star sits below a thin yellow line on dark blue.",
  },
  {
    code: "np",
    name: "Nepal",
    continent: "Asia",
    capital: "Kathmandu",
    flagHint:
      "Two stacked red pennants with blue edges contain white moon and sun symbols.",
  },
  {
    code: "nl",
    name: "Netherlands",
    continent: "Europe",
    capital: "Amsterdam",
    flagHint: "Three horizontal bands: red, white, dark blue.",
  },
  {
    code: "nz",
    name: "New Zealand",
    continent: "Oceania",
    capital: "Wellington",
    flagHint: "Four red stars with white borders and a Union Jack sit on blue.",
  },
  {
    code: "ni",
    name: "Nicaragua",
    continent: "North America",
    capital: "Managua",
    flagHint: "A triangular coat of arms sits in white between two blue bands.",
  },
  {
    code: "ne",
    name: "Niger",
    continent: "Africa",
    capital: "Niamey",
    flagHint: "An orange disc sits in white between orange and green bands.",
  },
  {
    code: "ng",
    name: "Nigeria",
    continent: "Africa",
    capital: "Abuja",
    flagHint: "Three vertical bands: green, white, green.",
  },
  {
    code: "kp",
    name: "North Korea",
    continent: "Asia",
    capital: "Pyongyang",
    flagHint:
      "A red star in a white disc sits on a broad red stripe between blue borders.",
  },
  {
    code: "mk",
    name: "North Macedonia",
    continent: "Europe",
    capital: "Skopje",
    flagHint:
      "Eight broad yellow rays stretch from a yellow sun to the edges of red.",
  },
  {
    code: "no",
    name: "Norway",
    continent: "Europe",
    capital: "Oslo",
    flagHint: "A white-edged blue Nordic cross stretches across red.",
  },
  {
    code: "om",
    name: "Oman",
    continent: "Asia",
    capital: "Muscat",
    flagHint:
      "A red vertical band with the national emblem meets white, red and green stripes.",
  },
  {
    code: "pk",
    name: "Pakistan",
    continent: "Asia",
    capital: "Islamabad",
    flagHint:
      "A white crescent and star sit on dark green beside a white vertical band.",
  },
  {
    code: "pw",
    name: "Palau",
    continent: "Oceania",
    capital: "Ngerulmud",
    flagHint: "A golden disc, slightly toward the hoist, sits on light blue.",
  },
  {
    code: "ps",
    name: "Palestine",
    continent: "Asia",
    capital: "East Jerusalem (claimed); Ramallah (administrative)",
    flagHint:
      "A red triangle points into black, white and green horizontal stripes.",
  },
  {
    code: "pa",
    name: "Panama",
    continent: "North America",
    capital: "Panama City",
    flagHint:
      "Four quarters alternate white with a blue star, red, blue and white with a red star.",
  },
  {
    code: "pg",
    name: "Papua New Guinea",
    continent: "Oceania",
    capital: "Port Moresby",
    flagHint:
      "A yellow bird-of-paradise on red faces the Southern Cross on black.",
  },
  {
    code: "py",
    name: "Paraguay",
    continent: "South America",
    capital: "Asunción",
    flagHint:
      "Red, white and blue stripes; its two sides have different central seals.",
  },
  {
    code: "pe",
    name: "Peru",
    continent: "South America",
    capital: "Lima",
    flagHint:
      "Three vertical bands: red, white, red; the state flag adds a coat of arms.",
  },
  {
    code: "ph",
    name: "Philippines",
    continent: "Asia",
    capital: "Manila",
    flagHint:
      "A white triangle with a sun and three stars meets blue above red in peacetime.",
  },
  {
    code: "pl",
    name: "Poland",
    continent: "Europe",
    capital: "Warsaw",
    flagHint: "Two equal horizontal bands: white above red.",
  },
  {
    code: "pt",
    name: "Portugal",
    continent: "Europe",
    capital: "Lisbon",
    flagHint:
      "An armillary sphere and shield sit at the boundary of green and red.",
  },
  {
    code: "qa",
    name: "Qatar",
    continent: "Asia",
    capital: "Doha",
    flagHint:
      "Nine white teeth separate the white hoist from the maroon field.",
  },
  {
    code: "cg",
    name: "Republic of the Congo",
    continent: "Africa",
    capital: "Brazzaville",
    flagHint: "A diagonal yellow band separates green and red corners.",
  },
  {
    code: "ro",
    name: "Romania",
    continent: "Europe",
    capital: "Bucharest",
    flagHint:
      "Three vertical bands: blue, yellow, red. Its blue is brighter than Chad's.",
  },
  {
    code: "ru",
    name: "Russia",
    continent: "Europe",
    capital: "Moscow",
    flagHint: "Three horizontal bands: white, blue, red.",
  },
  {
    code: "rw",
    name: "Rwanda",
    continent: "Africa",
    capital: "Kigali",
    flagHint: "A golden sun sits in a wide blue band above yellow and green.",
  },
  {
    code: "kn",
    name: "Saint Kitts and Nevis",
    continent: "North America",
    capital: "Basseterre",
    flagHint:
      "A yellow-edged black diagonal with two white stars divides green and red.",
  },
  {
    code: "lc",
    name: "Saint Lucia",
    continent: "North America",
    capital: "Castries",
    flagHint:
      "White, black and yellow triangles rise together from light blue.",
  },
  {
    code: "vc",
    name: "Saint Vincent and the Grenadines",
    continent: "North America",
    capital: "Kingstown",
    flagHint:
      "Three green diamonds sit in yellow between blue and green vertical bands.",
  },
  {
    code: "ws",
    name: "Samoa",
    continent: "Oceania",
    capital: "Apia",
    flagHint: "Five white Southern Cross stars sit in a blue canton on red.",
  },
  {
    code: "sm",
    name: "San Marino",
    continent: "Europe",
    capital: "City of San Marino",
    flagHint: "A shield with three towers sits on white above light blue.",
  },
  {
    code: "sa",
    name: "Saudi Arabia",
    continent: "Asia",
    capital: "Riyadh",
    flagHint: "White Arabic calligraphy and a horizontal sword sit on green.",
  },
  {
    code: "sn",
    name: "Senegal",
    continent: "Africa",
    capital: "Dakar",
    flagHint: "A green star sits in the yellow stripe between green and red.",
  },
  {
    code: "rs",
    name: "Serbia",
    continent: "Europe",
    capital: "Belgrade",
    flagHint:
      "A crowned double-headed eagle sits toward the hoist on red, blue and white.",
  },
  {
    code: "sc",
    name: "Seychelles",
    continent: "Africa",
    capital: "Victoria",
    flagHint:
      "Five colored rays fan out from the lower hoist: blue, yellow, red, white and green.",
  },
  {
    code: "sl",
    name: "Sierra Leone",
    continent: "Africa",
    capital: "Freetown",
    flagHint: "Three horizontal bands: green, white, blue.",
  },
  {
    code: "sg",
    name: "Singapore",
    continent: "Asia",
    capital: "Singapore",
    flagHint: "A white crescent and five stars sit in red above white.",
  },
  {
    code: "sk",
    name: "Slovakia",
    continent: "Europe",
    capital: "Bratislava",
    flagHint:
      "A double cross on three hills sits toward the hoist on white, blue and red.",
  },
  {
    code: "si",
    name: "Slovenia",
    continent: "Europe",
    capital: "Ljubljana",
    flagHint:
      "A shield showing Mount Triglav sits near the hoist on white, blue and red.",
  },
  {
    code: "sb",
    name: "Solomon Islands",
    continent: "Oceania",
    capital: "Honiara",
    flagHint:
      "A yellow diagonal separates five white stars on blue from green.",
  },
  {
    code: "so",
    name: "Somalia",
    continent: "Africa",
    capital: "Mogadishu",
    flagHint: "One white five-pointed star sits on sky blue.",
  },
  {
    code: "za",
    name: "South Africa",
    continent: "Africa",
    capital: "Pretoria / Cape Town / Bloemfontein",
    flagHint:
      "A green Y with white and gold borders separates black, red and blue sections.",
  },
  {
    code: "kr",
    name: "South Korea",
    continent: "Asia",
    capital: "Seoul",
    flagHint: "A red-and-blue taegeuk and four black trigrams sit on white.",
  },
  {
    code: "ss",
    name: "South Sudan",
    continent: "Africa",
    capital: "Juba",
    flagHint:
      "A yellow star sits in a blue triangle beside black, red and green stripes.",
  },
  {
    code: "es",
    name: "Spain",
    continent: "Europe",
    capital: "Madrid",
    flagHint:
      "A wide yellow band with a coat of arms lies between two red bands.",
  },
  {
    code: "lk",
    name: "Sri Lanka",
    continent: "Asia",
    capital: "Sri Jayawardenepura Kotte",
    flagHint:
      "A golden lion holding a sword sits on maroon beside orange and green bands.",
  },
  {
    code: "sd",
    name: "Sudan",
    continent: "Africa",
    capital: "Khartoum",
    flagHint:
      "A green triangle points into red, white and black horizontal bands.",
  },
  {
    code: "sr",
    name: "Suriname",
    continent: "South America",
    capital: "Paramaribo",
    flagHint:
      "A yellow star sits in a wide red band between white and green stripes.",
  },
  {
    code: "se",
    name: "Sweden",
    continent: "Europe",
    capital: "Stockholm",
    flagHint: "A yellow Nordic cross stretches across blue.",
  },
  {
    code: "ch",
    name: "Switzerland",
    continent: "Europe",
    capital: "Bern",
    flagHint: "A white upright cross sits on a square red field.",
  },
  {
    code: "sy",
    name: "Syria",
    continent: "Asia",
    capital: "Damascus",
    flagHint:
      "Three red stars sit in the white band between green and black, in use since December 2024.",
  },
  {
    code: "st",
    name: "São Tomé and Príncipe",
    continent: "Africa",
    capital: "São Tomé",
    flagHint:
      "Two black stars sit in yellow, between green bands and beside a red triangle.",
  },
  {
    code: "tj",
    name: "Tajikistan",
    continent: "Asia",
    capital: "Dushanbe",
    flagHint:
      "A gold crown and seven stars sit in white between red and green.",
  },
  {
    code: "tz",
    name: "Tanzania",
    continent: "Africa",
    capital: "Dodoma",
    flagHint: "A yellow-edged black diagonal separates green and blue corners.",
  },
  {
    code: "th",
    name: "Thailand",
    continent: "Asia",
    capital: "Bangkok",
    flagHint: "A wide blue central band is flanked by white and red bands.",
  },
  {
    code: "tl",
    name: "Timor-Leste",
    continent: "Asia",
    capital: "Dili",
    flagHint:
      "A white star sits in a black triangle layered over a yellow triangle on red.",
  },
  {
    code: "tg",
    name: "Togo",
    continent: "Africa",
    capital: "Lomé",
    flagHint:
      "A white star in a red square accompanies five green-and-yellow stripes.",
  },
  {
    code: "to",
    name: "Tonga",
    continent: "Oceania",
    capital: "Nuku'alofa",
    flagHint: "A red cross in a white canton sits on a red field.",
  },
  {
    code: "tt",
    name: "Trinidad and Tobago",
    continent: "North America",
    capital: "Port of Spain",
    flagHint: "A white-edged black diagonal descends across a red field.",
  },
  {
    code: "tn",
    name: "Tunisia",
    continent: "Africa",
    capital: "Tunis",
    flagHint: "A red crescent and star sit inside a white disc on red.",
  },
  {
    code: "tm",
    name: "Turkmenistan",
    continent: "Asia",
    capital: "Ashgabat",
    flagHint:
      "A white crescent and five stars sit on green beside a vertical carpet-pattern band.",
  },
  {
    code: "tv",
    name: "Tuvalu",
    continent: "Oceania",
    capital: "Funafuti",
    flagHint: "Nine yellow stars and a Union Jack sit on light blue.",
  },
  {
    code: "tr",
    name: "Türkiye",
    continent: "Asia",
    capital: "Ankara",
    flagHint: "A white crescent and five-pointed star sit on red.",
  },
  {
    code: "ug",
    name: "Uganda",
    continent: "Africa",
    capital: "Kampala",
    flagHint:
      "A grey crowned crane in a white disc sits over black, yellow and red stripes.",
  },
  {
    code: "ua",
    name: "Ukraine",
    continent: "Europe",
    capital: "Kyiv",
    flagHint: "Two equal horizontal bands: blue above yellow.",
  },
  {
    code: "ae",
    name: "United Arab Emirates",
    continent: "Asia",
    capital: "Abu Dhabi",
    flagHint:
      "A red vertical band meets green, white and black horizontal bands.",
  },
  {
    code: "gb",
    name: "United Kingdom",
    continent: "Europe",
    capital: "London",
    flagHint: "Red and white crosses combine on blue to form the Union Jack.",
  },
  {
    code: "us",
    name: "United States",
    continent: "North America",
    capital: "Washington D.C.",
    flagHint:
      "Fifty white stars in a blue canton accompany thirteen red-and-white stripes.",
  },
  {
    code: "uy",
    name: "Uruguay",
    continent: "South America",
    capital: "Montevideo",
    flagHint:
      "The Sun of May accompanies nine alternating white-and-blue stripes.",
  },
  {
    code: "uz",
    name: "Uzbekistan",
    continent: "Asia",
    capital: "Tashkent",
    flagHint:
      "A crescent and twelve stars sit on blue above white and green, edged in red.",
  },
  {
    code: "vu",
    name: "Vanuatu",
    continent: "Oceania",
    capital: "Port Vila",
    flagHint:
      "A yellow-edged black Y divides red and green, beside a boar-tusk emblem.",
  },
  {
    code: "va",
    name: "Vatican City",
    continent: "Europe",
    capital: "Vatican City",
    flagHint:
      "Yellow and white vertical halves carry crossed keys and the papal tiara.",
  },
  {
    code: "ve",
    name: "Venezuela",
    continent: "South America",
    capital: "Caracas",
    flagHint: "Eight white stars arc across blue between yellow and red bands.",
  },
  {
    code: "vn",
    name: "Vietnam",
    continent: "Asia",
    capital: "Hanoi",
    flagHint: "One large yellow five-pointed star sits on red.",
  },
  {
    code: "ye",
    name: "Yemen",
    continent: "Asia",
    capital: "Sana'a",
    flagHint: "Three horizontal bands: red, white, black.",
  },
  {
    code: "zm",
    name: "Zambia",
    continent: "Africa",
    capital: "Lusaka",
    flagHint:
      "An orange eagle flies above red, black and orange vertical bars on green.",
  },
  {
    code: "zw",
    name: "Zimbabwe",
    continent: "Africa",
    capital: "Harare",
    flagHint:
      "A stone Zimbabwe Bird and red star sit in a white triangle beside seven stripes.",
  },
];
