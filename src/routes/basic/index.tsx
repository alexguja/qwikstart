import { component$, useStore, Resource, useResource$ } from "@builder.io/qwik";

export default component$(() => {
  // useStore is used to
  // - Store the state of the component
  // - Present the state as a proxy that can observe read/writes to the store
  // - Serialize the state of the store into JSON on application pause.
  // - Observe which properties of the store are used in a component template and create subscriptions to the store.
  //   The subscriptions are then used to automatically update the component template if a store changes.
  const github = useStore({
    org: "QwikDev",
  });

  const reposResource = useResource$<string[]>(({ track, cleanup }) => {
    // We need a way to re-run fetching data whenever the `github.org` changes.
    // Use `track` to trigger re-running of this data fetching function.
    track(() => github.org);

    // A good practice is to use `AbortController` to abort the fetching of data if
    // new request comes in. We create a new `AbortController` and register a `cleanup`
    // function which is called when this function re-runs.
    const controller = new AbortController();
    cleanup(() => controller.abort());

    // Fetch the data and return the promises.
    return getRepositories(github.org, controller);
  });

  return (
    <main>
      <p>
        <label>
          GitHub username:
          <input
            value={github.org}
            onInput$={(ev, el) => (github.org = el.value)}
          />
        </label>
      </p>
      <section>
        <Resource
          value={reposResource}
          onPending={() => <>Loading...</>}
          onRejected={(error) => <>Error: {error.message}</>}
          onResolved={(repos) => (
            <ul>
              {repos.map((repo) => (
                <li>
                  <a href={`https://github.com/${github.org}/${repo}`}>
                    {repo}
                  </a>
                </li>
              ))}
            </ul>
          )}
        />
      </section>
    </main>
  );
});

export async function getRepositories(
  username: string,
  controller?: AbortController
): Promise<string[]> {
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    signal: controller?.signal,
  });

  const json = await resp.json();
  return Array.isArray(json)
    ? json.map((repo: { name: string }) => repo.name)
    : Promise.reject(json);
}
