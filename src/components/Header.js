'use client';
import styled from "styled-components";

const Wrapper = styled.header`
  padding: 2rem;/* 
  background-color: #1e1e1e; */
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #9c4444ff;
  margin: 0;
`;

export default function Header() {
  return (
    <Wrapper>
      <Title>Crypto Tracker</Title>
    </Wrapper>
  );
}