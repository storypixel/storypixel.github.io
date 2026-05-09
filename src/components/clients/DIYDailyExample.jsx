import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { exampleHtmlPath, findExample } from './diyDailyData';

// The drill-down route just redirects to the raw email HTML so Quint
// sees the email by itself — no React shell, no toolbar, no iframe.
export default function DIYDailyExample() {
  const { exampleId } = useParams();
  const example = findExample(exampleId);

  useEffect(() => {
    if (example) {
      window.location.replace(exampleHtmlPath(example.id));
    }
  }, [example]);

  if (!example) {
    return <Navigate to="/clients/diy-daily" replace />;
  }

  return null;
}
