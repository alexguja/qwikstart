import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <main>
      <Greeter />
    </main>
  );
});

// Note: If component$ is removed below
// the component will be inlined with the component above
export const Greeter = component$(() => {
  return <div>Hello World!</div>;
});

