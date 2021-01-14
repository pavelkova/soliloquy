import { palettes } from 'styles/themes'

export const Header = () => (
  <div>
    <h1>soliloquy</h1>
    <style jsx>{`
h1 {
font-family: Playfair Display;
font-style: italic;
font-size: 2rem;
color: ${palettes.metals.brighter};
}
      `}</style>
  </div>
)
