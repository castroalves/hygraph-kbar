import React from 'react';

import {
  KBarAnimator,
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  KBarResults,
  useMatches,
} from 'kbar';

const createUrl = (path, sectionName) => {
  const urlSegments = path
    .split('/');
  const newUrl = [
    urlSegments[1],
    urlSegments[2],
    sectionName
  ].join('/');
  return newUrl;
}

const defaultActions = [
  {
    id: "schema",
    name: "Schema",
    shortcut: ["s"],
    keywords: "schema",
    section: "Developers",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "schema");
    },
  },
  {
    id: "content",
    name: "Content",
    shortcut: ["c"],
    keywords: "content",
    section: "General",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "content");
    },
  },
  {
    id: "assets",
    name: "Assets",
    keywords: "assets",
    section: "General",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "assets");
    },
  },
  {
    id: "api-playground",
    name: "API Playground",
    shortcut: ["a", "p", "i"],
    keywords: "api-playground",
    section: "Developers",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "graphiql");
    },
  },
  {
    id: "webhooks",
    name: "Webhooks",
    shortcut: ["w"],
    keywords: "webhooks",
    section: "Webhooks",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "webhooks");
    },
  },
  {
    id: "create-webhook",
    name: "Create Webhook",
    keywords: "create",
    section: "Webhooks",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "webhooks/create");
    },
  },
  {
    id: "settings",
    name: "Settings",
    keywords: "settings",
    section: "Admin",
    perform: () => {
      window.location.pathname = createUrl(window.location.pathname, "settings");
    },
  },
  {
    id: "my-projects",
    name: "My Projects",
    keywords: "projects",
    section: "Projects",
    perform: () => {
      window.location.pathname = "/";
    },
  },
  {
    id: "new-project",
    name: "New Project",
    shortcut: ["+"],
    keywords: "new +",
    section: "Projects",
    perform: () => {
      window.location.pathname = "/create"
    }
  },
  {
    id: "read-docs",
    name: "Read Documentation",
    keywords: "read docs",
    section: "Help",
    perform: () => {
      window.location = "https://graphcms.com/docs";
    },
  },
  {
    id: "slack-community",
    name: "Join Slack Community",
    keywords: "slack community",
    section: "Help",
    perform: () => {
      window.location = "https://slack.graphcms.com";
    },
  },
];

const backgroundColor = "#1c1c1d";
const color = "#fcfcfc";
const searchStyle = {
  padding: "12px 16px",
  fontFamily: `'Source Code Pro', monospace`,
  fontSize: "16px",
  width: "100%",
  outline: "none",
  border: "none",
  backgroundColor,
  color,
};
const positionerStyle = {
  zIndex: 100, // HackMD's .ui-resizable-handle has { z-index: 90 }
};
const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  backgroundColor,
  color,
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "rgb(0 0 0 / 50%) 0px 16px 70px",
};
const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "12px",
  opacity: 0.5,
};

const CommandBar = () => {
  return (
    <KBarProvider actions={defaultActions}>
      <KBarPortal>
        <KBarPositioner style={positionerStyle}>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch style={searchStyle} placeholder="Type something here..." />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
};

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    },
    ref,
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId);
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Switch Team" parent action,
      // the UI should not display "Switch Team > My Workspace"
      // but rather just "My Workspace"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          margin: "2px 8px",
          padding: "8px 8px",
          background: active ? "rgb(53 53 54)" : "transparent",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && <span style={{ fontSize: 12, opacity: 0.75 }}>{action.subtitle}</span>}
          </div>
        </div>
        {action.shortcut?.length && (
          <div style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default CommandBar;
