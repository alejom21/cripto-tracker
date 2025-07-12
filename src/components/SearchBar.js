'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  outline: none;
`;

const Result = styled.div`
  margin-top: 1rem;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;
`;

const Coin = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
`;

const Img = styled.img`
  width: 32px;
  height: 32px;
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
`

const FollowButton = styled.button`
  background-color: #00ffff;
    border: none;
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #00cccc;
  }
`;

const FollowedList = styled.div`
    margin-top: 2rem;
`;

const Price = styled.span`
  font-weight: bold;
  color: #00ff00;
`;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [followedCoins, setFollowedCoins] = useState([]);
  const [prices, setPrices] = useState({});

  const searchCoins = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/search?query=${value}`);
      setResults(res.data.coins.slice(0, 5)); 
    } catch (err) {
      console.error('Error al buscar criptomonedas:', err);
    }
  };

  const followCoin = (coin) => {
    const alreadyFollowed = followedCoins.some((c) => c.id === coin.id);
    if (!alreadyFollowed) {
      setFollowedCoins([...followedCoins, coin]);
    }
  };

  const fetchPrices = async () => {
    if (followedCoins.length === 0) return;

    const ids = followedCoins.map((coin) => coin.id).join(',');
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      setPrices(res.data);
    } catch (err) {
      console.error('Error al obtener precios:', err.message || err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [followedCoins]);

  return (
    <Container>
      <Input
        type="text"
        placeholder="Buscar criptomoneda (ej: bitcoin)"
        value={query}
        onChange={searchCoins}
      />

      {results.length > 0 && (
        <Result>
          {results.map((coin) => (
            <Coin key={coin.id}>
                <CoinInfo>
                    <Img src={coin.thumb} alt={coin.name} />
                    <span>{coin.name} ({coin.symbol.toUpperCase()})</span>            
                </CoinInfo>
                <FollowButton onClick={() => followCoin(coin)}>
                  Seguir
                </FollowButton>
            </Coin>
          ))}
        </Result>
      )}

        {followedCoins.length > 0 && (
          <FollowedList>
            <h3>Criptomonedas seguidas:</h3>
            <ul>
              {followedCoins.map((coin) => (
                <li key={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()}) - 
                  <Price> ${prices[coin.id]?.usd || 'Cargando...'}</Price>
                  {/* <Coin key={coin.id}>
                    <CoinInfo>
                      <Img src={coin.thumb} alt={coin.name} />
                      <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                    </CoinInfo>
                  </Coin> */}
                </li>                
              ))}
            </ul>            
          </FollowedList>
        )}
    </Container>
  );
}
