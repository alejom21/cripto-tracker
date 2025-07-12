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
  const [alerts, setAlerts] = useState([]);

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
        const updated = [...followedCoins, coin];
        setFollowedCoins(updated);
        localStorage.setItem('followedCoins', JSON.stringify(updated));
      }
  };

  const fetchPrices = async () => {
    if (followedCoins.length === 0) return;

    const ids = followedCoins.map((coin) => coin.id).join(',');
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = res.data;
      setPrices(res.data);

      //Alertas por cambios de precio mayores al 5%
      const newAlerts = [];
      followedCoins.forEach((coin) => {
        const change = data[coin.id]?.usd_24h_change;
        if (change >= 5) {
          newAlerts.push(`${coin.name} subió +${change.toFixed(2)}% en 24h 🚀`);
        } else if (change <= -5) {
          newAlerts.push(`${coin.name} bajó ${change.toFixed(2)}% en 24h 📉`);
        }
      });

      setAlerts(newAlerts);
    } catch (err) {
      console.error('Error al obtener precios:', err.message || err);
    }
  };

  const unfollowcoin = (id) => {
    const updated = followedCoins.filter((coin) => coin.id !== id);
    setFollowedCoins(updated);
    localStorage.setItem('followedCoins', JSON.stringify(updated));
  };

  useEffect(() => {
    if (followedCoins.length > 0) {
      fetchPrices();
    }
  }, [followedCoins]);

  useEffect(() => {
    if (followedCoins.length === 0) return;

    const interval = setInterval(() => {
      fetchPrices();
    }, 45000);

    return () => clearInterval(interval);
  }, [followedCoins.length]);

  useEffect(() => {
    const stored = localStorage.getItem('followedCoins');
    if (stored) {
      setFollowedCoins(JSON.parse(stored));
    }
  }, []);

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
              <li key={coin.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span>
                  {coin.name} ({coin.symbol.toUpperCase()}) - 
                  <Price> ${prices[coin.id]?.usd || 'Cargando...'}</Price>
                </span>
                <button
                  onClick={() => unfollowcoin(coin.id)}
                  style={{ background: 'red', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Dejar de seguir
                </button>
                
              </li>                
            ))}
          </ul>            
        </FollowedList>
      )}

      {alerts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>⚠️ Alertas de variación:</h4>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} style={{ color: '#FFD700', fontWeight: 'bold' }}>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
