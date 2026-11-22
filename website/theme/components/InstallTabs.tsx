import { useRef, useState } from 'react';

const managers = [
  { name: 'npm', color: 'CB3837', command: 'npm install byenull' },
  { name: 'pnpm', color: 'F69220', command: 'pnpm add byenull' },
  { name: 'yarn', color: '2C8EBB', command: 'yarn add byenull' },
  { name: 'bun', color: 'FBF0DF', command: 'bun add byenull' },
] as const;

export function InstallTabs() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    setSelected(index);
    setCopied(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    let next = selected;
    if (event.key === 'ArrowRight') next = (selected + 1) % managers.length;
    else if (event.key === 'ArrowLeft') next = (selected + managers.length - 1) % managers.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = managers.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(managers[selected].command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="install-tabs">
      <div className="install-tab-list" role="tablist" aria-label="Package manager">
        {managers.map((manager, index) => (
          <button key={manager.name} ref={(element) => { tabs.current[index] = element; }} type="button"
            role="tab" id={`install-tab-${manager.name}/${manager.color}`} aria-selected={selected === index}
            aria-controls="install-panel" tabIndex={selected === index ? 0 : -1}
            onClick={() => select(index)} onKeyDown={onKeyDown}>
            <img src={`https://cdn.simpleicons.org/${manager.name}/${manager.color}`} alt="" width="16" height="16" />
            {manager.name}
          </button>
        ))}
      </div>
      <div className="install-command" role="tabpanel" id="install-panel" aria-labelledby={`install-tab-${managers[selected].name}`}>
        <span aria-hidden="true">$</span><code>{managers[selected].command}</code>
        <button type="button" onClick={copy} aria-label={`Copy ${managers[selected].name} install command`} title="Copy command">
          {copied ? 'Copied' : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>}
        </button>
      </div>
    </div>
  );
}
