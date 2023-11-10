export default function ColorSchemeManager(options) {
  const { key = "mantine-color-scheme" } = options;
  let handleStorageEvent;

  const isBrowser = typeof window !== "undefined";

  return {
    get: function (defaultValue) {
      if (!isBrowser) {
        return defaultValue;
      }

      try {
        return window.localStorage.getItem(key) || defaultValue;
      } catch {
        return defaultValue;
      }
    },

    set: function (value) {
      if (!isBrowser) {
        return;
      }

      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn(
          "[@mantine/core] Local storage color scheme manager was unable to save color scheme.",
          error
        );
      }
    },

    subscribe: function (onUpdate) {
      if (!isBrowser) {
        return;
      }

      handleStorageEvent = function (event) {
        if (event.storageArea === window.localStorage && event.key === key) {
          if (isMantineColorScheme(event.newValue)) {
            onUpdate(event.newValue);
          }
        }
      };

      window.addEventListener("storage", handleStorageEvent);
    },

    unsubscribe: function () {
      if (isBrowser) {
        window.removeEventListener("storage", handleStorageEvent);
      }
    },

    clear: function () {
      if (isBrowser) {
        window.localStorage.removeItem(key);
      }
    },
  };
}
