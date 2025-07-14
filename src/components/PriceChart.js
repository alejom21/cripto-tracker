'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';

const ChartWrapper = styled.div`
  width: 100%;
  height: 120px;
  margin-top: 0.5rem;
`;

export default function PriceChart({ coinId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        const prices = res.data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('en-US', {
            weekday: 'short',
          }),
          price: Number(price.toFixed(2)),
        }));
        setData(prices);
      } catch (err) {
        console.error('Error al cargar la gráfica:', err);
      }
    };

    fetchChart();
  }, [coinId]);

  useEffect(() => {
  const delay = Math.random() * 1000 + 500; // entre 500ms y 1500ms
  const timeout = setTimeout(() => {
    fetchChart();
  }, delay);

  return () => clearTimeout(timeout);
}, [coinId]);

  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#ccc' }} />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip
            formatter={(value) => `$${value}`}
            contentStyle={{ background: '#222', border: 'none' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00ffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
