const Theme = Object.freeze({
  palette: Object.freeze({
    blackRed: '#140C1C',
    darkPurple: '#442434',
    darkBlue: '#30346D',
    darkGrey: '#4E4A4E',

    brown: '#854C30',
    green: '#346524',
    red: '#D04648',
    grey: '#757161',

    blue: '#597DEC',
    orange: '#D27D2C',
    lightGrey: '#8595A1',
    lime: '#6DAA2C',

    beige: '#D2AA99',
    cyan: '#6BC2CA',
    yellow: '#DAD45E',
    mint: '#DEEED6',

    black: '#000000',
    white: '#FFFFFF',
    text: Object.freeze({
      primary: '#140C1C', // blackRed,
      secondary: '#4E4A4E', // darkGrey
      hint: '#757161', // grey
      disabled: '#E0E0E0',
      contrastText: '#FFFFFF', // white
    }),
    player: Object.freeze({
      red: '#D04648',
      blue: '#597DCE',
      // green: '#6DC2CA', // TODO: add more players
      // orange: '#D27D2C',
    }),
    robot: Object.freeze({
      grey: '#8594A1',
      // blue: '#597DCE',
      // green: '#6DC2CA', // TODO: add more players
      // orange: '#D27D2C',
    }),
  }),
  text: Object.freeze({
    fontSize: Object.freeze({
      small: 16,
      medium: 20,
      large: 32,
      title: 48,
    }),
  }),
});
