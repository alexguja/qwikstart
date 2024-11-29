import { component$, useStore } from "@builder.io/qwik";

export default component$(() => {
  // useStore is used to
  // - Store the state of the component
  // - Present the state as a proxy that can observe read/writes to the store
  // - Serialize the state of the store into JSON on application pause.
  // - Observe which properties of the store are used in a component template and create subscriptions to the store.
  //   The subscriptions are then used to automatically update the component template if a store changes.
  const github = useStore({
    org: "QwikDev",
    repos: ["qwik", "partytown"] as string[] | null,
  });

  return (
    <main>
      <p>
        <label>
          GitHub organization:
          <input value="QwikDev" />
        </label>
      </p>
      <section>
        <ul>
          <li>
            <a href="https://github.com/QwikDev/qwik">Qwik</a>
          </li>
          <li>
            <a href="https://github.com/BuilderIO/partytown">Partytown</a>
          </li>
        </ul>
      </section>
    </main>
  );
});
