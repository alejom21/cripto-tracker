'use client';

const { createGlobalStyle } = require("styled-components")

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #121212;
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;