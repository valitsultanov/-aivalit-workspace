export type Pal = {
  sky1: string; sky2: string; sun: string; cloud: string; cloudShade: string;
  hill: string; hillBack: string; hoodie: string; hoodieDark: string; jeans: string; jeansDark: string;
  shoe: string; skin: string; hair: string; ink: string; mouth: string; cheek: string;
  camera: string; lens: string; cat: string; catDark: string; catLight: string; catPink: string;
  bal1: string; bal2: string; basket: string; rope: string;
};

/** the original flat-vector scene */
export const BASE: Pal = {
  sky1: '#3FA7F2', sky2: '#A9E1FF', sun: '#FFD23F', cloud: '#FFFFFF', cloudShade: '#DDEBFA',
  hill: '#57BE63', hillBack: '#8ED884', hoodie: '#E63B2E', hoodieDark: '#B62A21', jeans: '#3A6FD8', jeansDark: '#2B55AE',
  shoe: '#FFFFFF', skin: '#E3A673', hair: '#2B1B14', ink: '#22160F', mouth: '#7A1E22', cheek: '#F07A7A',
  camera: '#17171A', lens: '#5A5F6B', cat: '#F28C28', catDark: '#C9650F', catLight: '#FFD9AE', catPink: '#F59AA6',
  bal1: '#E2373F', bal2: '#FFF0D4', basket: '#8B5A2B', rope: '#5B3A1C',
};

export const pal = (o: Partial<Pal>): Pal => ({...BASE, ...o});
