'use client';
import styled from "styled-components";

const wrapper = styled.header`
  padding: 2rem;
  background-color: #1e1e1e;
  text-align: center;
`;

const title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin: 0;
`;

const subtitle = styled.h2`
  font-size: 1.5rem;
  color: #ccc;
  margin-top: 0.5rem;
`;

export default function Header() {
  return (
    <wrapper>
      <title>Crypto Tracker</title>
      <subtitle>Suscribete y recibe las variaciones del precio</subtitle>
    </wrapper>
  );
}