import { Inter, Roboto, Heebo, Barlow, Ultra, PT_Serif, Montserrat, Hind, Archivo_Black, Archivo } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['900'], subsets: ['latin'] });
const heebo = Heebo({ weight: ['900'], subsets: ['latin'] });
const barlow = Barlow({ weight: ['900'], subsets: ['latin'] });
const ultra = Ultra({ weight: ['400'], subsets: ['latin'] });
const ptSerif = PT_Serif({ weight: ['400'], subsets: ['latin'] });
const montserrat = Montserrat({ weight: ['900'], subsets: ['latin'] });
const hind = Hind({ weight: ['400'], subsets: ['latin'] });
const archivo = Archivo({ subsets: ['latin'] })
const archivoBlack = Archivo_Black({ weight: ['400'], subsets: ['latin'] })


const fonts = {
  body: inter.style.fontFamily,
  heading: archivoBlack.style.fontFamily,
  header: archivoBlack.style.fontFamily
}

export default fonts;