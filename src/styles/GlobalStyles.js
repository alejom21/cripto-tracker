'use client';

const { createGlobalStyle } = require("styled-components")

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    justify-items: center;
    font-family: sans-serif;
    /* background-color: #121212; */
    /* color: #ffffff; */
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;