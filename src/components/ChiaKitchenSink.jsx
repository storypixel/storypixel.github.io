import React from 'react';
import {
    ArrowUpRight,
    Bell,
    Check,
    Checks,
    DotsThree,
    DownloadSimple,
    FunnelSimple,
    GearSix,
    Leaf,
    MagnifyingGlass,
    Plus,
    Sparkle,
} from '@phosphor-icons/react';
import './ChiaKitchenSink.css';

const modules = ['tokens', 'reset', 'components', 'utilities', 'grid', 'animation'];

const tasks = [
    { title: 'Document data-slot card anatomy', status: 'Ready', accent: 'green' },
    { title: 'Tune focus ring contrast', status: 'Review', accent: 'blue' },
    { title: 'Ship form variants', status: 'Queued', accent: 'amber' },
];

const releases = [
    { file: 'tokens.css', owner: 'Core', status: 'Stable', size: '4.1kb' },
    { file: 'components.css', owner: 'UI', status: 'Review', size: '11.8kb' },
    { file: 'grid.css', owner: 'Layout', status: 'Stable', size: '3.7kb' },
    { file: 'animations.css', owner: 'Motion', status: 'Draft', size: '2.9kb' },
];

const ChiaKitchenSink = () => {
    return (
        <main className="chia-ks" data-theme="forest">
            <section className="chia-ks-shell chia-ks-shot" data-shot="dashboard" aria-label="Chia dashboard mockup">
                <aside className="chia-ks-sidebar">
                    <div className="chia-ks-brand">
                        <img src="/images/chia/chia-logo.svg" alt="Chia" />
                    </div>
                    <nav className="chia-ks-nav" aria-label="Kitchen sink sections">
                        {modules.map((module, index) => (
                            <a key={module} href={`#${module}`} data-active={index === 2 ? 'true' : undefined}>
                                {module}
                            </a>
                        ))}
                    </nav>
                    <div className="chia-ks-sidebar-card" data-slot="card">
                        <p>Specificity</p>
                        <strong>0.1.0</strong>
                        <span>flat selectors across every component</span>
                    </div>
                </aside>

                <div className="chia-ks-main">
                    <header className="chia-ks-topbar">
                        <label className="chia-ks-search" data-slot="input">
                            <MagnifyingGlass size={16} weight="bold" />
                            <input aria-label="Search components" value="button variants" readOnly />
                        </label>
                        <div className="chia-ks-actions">
                            <button type="button" data-slot="icon-button" aria-label="Notifications">
                                <Bell size={17} weight="bold" />
                            </button>
                            <button type="button" data-slot="icon-button" aria-label="Settings">
                                <GearSix size={17} weight="bold" />
                            </button>
                        </div>
                    </header>

                    <section className="chia-ks-hero-card" data-slot="card">
                        <div>
                            <span data-slot="badge" data-variant="green">
                                <Leaf size={14} weight="fill" />
                                Components
                            </span>
                            <h1>Real selectors. Calm defaults. Zero build step.</h1>
                            <p>
                                Chia styles ordinary markup with data attributes, custom properties,
                                and a cascade that stays easy to reason about.
                            </p>
                        </div>
                        <div className="chia-ks-hero-actions">
                            <button type="button" data-slot="button" data-variant="primary">
                                <Sparkle size={16} weight="bold" />
                                New pattern
                            </button>
                            <button type="button" data-slot="button" data-variant="secondary">
                                <ArrowUpRight size={16} weight="bold" />
                                View docs
                            </button>
                        </div>
                    </section>

                    <section className="chia-ks-metrics" aria-label="Chia metrics">
                        {[
                            ['24', 'component parts', 'green'],
                            ['6', 'standalone files', 'blue'],
                            ['0', 'important rules', 'amber'],
                        ].map(([value, label, accent]) => (
                            <div className="chia-ks-metric" data-slot="card" data-accent={accent} key={label}>
                                <span>{label}</span>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </section>

                    <section className="chia-ks-task-grid">
                        {tasks.map((task) => (
                            <article className="chia-ks-task" data-slot="card" key={task.title}>
                                <span data-slot="badge" data-variant={task.accent}>{task.status}</span>
                                <h2>{task.title}</h2>
                                <div className="chia-ks-progress" aria-hidden="true">
                                    <span style={{ width: task.status === 'Ready' ? '86%' : task.status === 'Review' ? '62%' : '34%' }} />
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </section>

            <section className="chia-ks-panel-grid">
                <article className="chia-ks-panel chia-ks-shot" data-slot="card" data-shot="controls">
                    <div className="chia-ks-panel-header">
                        <div>
                            <p>Controls</p>
                            <h2>Component Kitchen</h2>
                        </div>
                        <span data-slot="badge" data-variant="blue">data-slot</span>
                    </div>

                    <form className="chia-ks-form">
                        <label>
                            Project name
                            <input data-slot="input" value="Chia Admin Kit" readOnly />
                        </label>
                        <label>
                            Surface
                            <select data-slot="input" value="dashboard" readOnly>
                                <option value="dashboard">Dashboard</option>
                            </select>
                        </label>
                        <fieldset className="chia-ks-segmented">
                            <legend>Density</legend>
                            <label><input type="radio" name="density" defaultChecked /> Comfortable</label>
                            <label><input type="radio" name="density" /> Compact</label>
                        </fieldset>
                        <div className="chia-ks-check-row">
                            <label><input type="checkbox" defaultChecked /> Focus visible</label>
                            <label><input type="checkbox" defaultChecked /> Reduced motion aware</label>
                        </div>
                        <div className="chia-ks-button-row">
                            <button type="button" data-slot="button" data-variant="primary">
                                <Check size={16} weight="bold" />
                                Save
                            </button>
                            <button type="button" data-slot="button" data-variant="ghost">
                                <DownloadSimple size={16} weight="bold" />
                                Export
                            </button>
                        </div>
                        <div className="chia-ks-token-grid" aria-label="Theme tokens">
                            {[
                                ['green', 'Action'],
                                ['teal', 'Info'],
                                ['amber', 'Caution'],
                                ['violet', 'Accent'],
                            ].map(([tone, label]) => (
                                <div className="chia-ks-token" data-tone={tone} key={tone}>
                                    <span />
                                    <p>{label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="chia-ks-note" data-slot="card">
                            <Sparkle size={18} weight="bold" />
                            <p>Theme by changing tokens. Component selectors stay exactly the same.</p>
                        </div>
                    </form>
                </article>

                <article className="chia-ks-panel chia-ks-shot" data-slot="card" data-shot="table">
                    <div className="chia-ks-panel-header">
                        <div>
                            <p>Release Table</p>
                            <h2>CSS Modules</h2>
                        </div>
                        <button type="button" data-slot="icon-button" aria-label="Filter modules">
                            <FunnelSimple size={17} weight="bold" />
                        </button>
                    </div>

                    <table className="chia-ks-table">
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Owner</th>
                                <th>Status</th>
                                <th>Size</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {releases.map((release) => (
                                <tr key={release.file}>
                                    <td>{release.file}</td>
                                    <td>{release.owner}</td>
                                    <td>
                                        <span data-slot="badge" data-variant={release.status === 'Stable' ? 'green' : release.status === 'Review' ? 'blue' : 'amber'}>
                                            {release.status}
                                        </span>
                                    </td>
                                    <td>{release.size}</td>
                                    <td>
                                        <button type="button" data-slot="icon-button" aria-label={`Open ${release.file}`}>
                                            <DotsThree size={17} weight="bold" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="chia-ks-callout" data-slot="card">
                        <Checks size={18} weight="bold" />
                        <p>Selectors stay shallow, so product code can override with ordinary CSS.</p>
                    </div>
                </article>
            </section>
        </main>
    );
};

export default ChiaKitchenSink;
