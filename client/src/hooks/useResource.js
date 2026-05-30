import { useEffect, useState } from 'react';
import { api, unwrap } from '../services/api';

export const useResource = (path) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    unwrap(api.get(path))
      .then((data) => setRows(data.items || []))
      .finally(() => setLoading(false));
  }, [path]);

  return { rows, loading, setRows };
};
