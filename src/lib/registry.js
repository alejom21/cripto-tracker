'use client';

import React from "react";
import { useState } from 'react';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }) {
  const [sheet] = useState(() => new ServerStyleSheet());

  return (
    <StyleSheetManager>
      {children}
    </StyleSheetManager>
  );
}
