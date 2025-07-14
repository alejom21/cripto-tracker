'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PriceChart from './PriceChart';


const Container = styled.div`
  justify-content: center;
  display: block;
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
  color: white;
  font-family: 'Geist', sans-serif;
`;

/* const Title = styled.h1`
  font-size: 2rem;
  color: #00ffff;
  margin-bottom: 1.5rem;
  text-align: center;
`; */

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  color: black;
  background-color: #f0f0f0;
  outline: none;

  &:focus {
    border-color: #00ffff;
  }
`;

const Result = styled.div`
  margin-top: 1rem;
  /*background: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;*/
`;

const Coin = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e1e1e;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  gap: 20px;
`;

const Img = styled.img`
  width: 32px;
  height: 32px;
  margin-right: 0.75rem;
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
  transition: all 0.2s ease;

  &:hover {
    background-color: #00cccc;
  }
`;

const DeleteButton = styled.button`
  background-color: #00ffff;
  border: none;
  color: #000;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: #00cccc;
  }
`;

const FollowedList = styled.div`
  margin-top: 2rem;
  h3 {
    color: #9c4444ff;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
`;

const Price = styled.span`
  font-weight: bold;
  color: #00ff00;
`;

const AlertBox = styled.li`
  background-color: #1e1e1e;
  border-left: 5px solid ${(props) => (props.positive ? '#00e676' : '#ff1744')};
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  font-weight: bold;
`;

const AlertH4 = styled.div`
  color: #ff4c4c; 
  margin: 20px;
  display: flex;
  justify-content: center;
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
        placeholder="Buscar criptomoneda... (2 caracteres mínimo)"
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
          
          {followedCoins.map((coin) => (            
            <Coin key={coin.id}>
              <CoinInfo>
                <img src={coin.thumb} alt={coin.name} />
                <span>
                  {coin.name} ({coin.symbol.toUpperCase()}) - 
                  <Price> ${prices[coin.id]?.usd || 'Cargando...'}</Price>
                </span>
             </CoinInfo>
              <PriceChart coinId={coin.id} />
              <DeleteButton 
                onClick={() => unfollowcoin(coin.id)}
                >
                Dejar de seguir
              </DeleteButton>              
            </Coin>                
          ))}          
        </FollowedList>
      )}

      {alerts.length > 0 && (
        <div>
          <AlertH4>
            <h4 >⚠️ Alertas de variación:</h4>
          </AlertH4>
          {alerts.map((alert, i) => (
            <AlertBox key={i} positive={alert.positive}>
              {alert.message || alert}
            </AlertBox>
          ))}
        </div>
      )}
    </Container>
  );
}
