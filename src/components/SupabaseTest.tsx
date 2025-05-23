import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(5);

        if (error) throw error;
        
        setData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      {loading && (
        <p className="text-gray-600">Testing connection...</p>
      )}
      
      {error && (
        <div className="text-red-500">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div>
          <p className="text-green-500 font-semibold mb-2">Connection successful!</p>
          <p className="text-gray-600">Found {data.length} profiles</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 