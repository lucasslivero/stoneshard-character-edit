import { useEffect } from 'react';

export function Home() {
  useEffect(() => {
    async function main() {
      const value = await window.api.getSaves();
      console.log(value);
      // await window.api.downloadPreset('helo', 'Worl');
    }
    main();
  }, []);

  return (
    <div className="px-10">
      Hello World + Shadcn
      <p />
    </div>
  );
}
