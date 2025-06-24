import { Body } from './body';
import { Caption } from './caption';
import { Display } from './display';
import { Headline } from './headline';
interface TypographyProps {
  Display: typeof Display;
  Body: typeof Body;
  Caption: typeof Caption;
  Headline: typeof Headline;
}

const Typography: TypographyProps = {
  Display,
  Body,
  Caption,
  Headline,
};

export default Typography;
