import { useSettingsStore, FONTS, FontKey } from '../store/settingsStore';
import './StylingDrawer.css';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sd-row">
      <span className="sd-row__label">{label}</span>
      <div className="sd-row__control">{children}</div>
    </div>
  );
}

function SizeSlider({
  label, value, min, max, onChange,
}: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <Row label={label}>
      <div className="sd-slider-group">
        <input
          type="range" min={min} max={max} step={1} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sd-slider"
        />
        <span className="sd-slider__value">{value}px</span>
      </div>
    </Row>
  );
}

function SpacingSlider({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Row label={label}>
      <div className="sd-slider-group">
        <input
          type="range" min={1.2} max={2.0} step={0.05} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sd-slider"
        />
        <span className="sd-slider__value">{value.toFixed(2)}</span>
      </div>
    </Row>
  );
}

function BoolRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row label={label}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`sd-toggle ${value ? 'sd-toggle--on' : ''}`}
      >
        <span className="sd-toggle__thumb" />
      </button>
    </Row>
  );
}

export default function StylingDrawer() {
  const { styling, setStyling, layoutId } = useSettingsStore();

  return (
    <div className="styling-drawer">
      <h3 className="sd-section-title">Colors</h3>

      <Row label="Primary">
        <input
          type="color" value={styling.primaryColor}
          onChange={(e) => setStyling('primaryColor', e.target.value)}
          className="sd-color"
        />
        <span className="sd-color__hex">{styling.primaryColor}</span>
      </Row>

      <Row label="Accent">
        <input
          type="color" value={styling.accentColor}
          onChange={(e) => setStyling('accentColor', e.target.value)}
          className="sd-color"
        />
        <span className="sd-color__hex">{styling.accentColor}</span>
      </Row>

      <div className="sd-divider" />
      <h3 className="sd-section-title">Font</h3>

      <Row label="Typeface">
        <select
          value={styling.font}
          onChange={(e) => setStyling('font', e.target.value as FontKey)}
          className="sd-select"
        >
          {(Object.entries(FONTS) as [FontKey, { label: string; css: string }][]).map(([key, f]) => (
            <option key={key} value={key} style={{ fontFamily: f.css }}>{f.label}</option>
          ))}
        </select>
      </Row>

      <div className="sd-divider" />
      <h3 className="sd-section-title">Sizes</h3>

      {layoutId === 'us-single' ? (
        <>
          <SizeSlider label="Name" value={styling.fontSizeUSName} min={18} max={48}
            onChange={(v) => setStyling('fontSizeUSName', v)} />
          <SizeSlider label="Title / tagline" value={styling.fontSizeUSTitle} min={10} max={22}
            onChange={(v) => setStyling('fontSizeUSTitle', v)} />
          <SizeSlider label="Contact items" value={styling.fontSizeUSContact} min={9} max={16}
            onChange={(v) => setStyling('fontSizeUSContact', v)} />
          <SizeSlider label="Section titles" value={styling.fontSizeTitle} min={9} max={18}
            onChange={(v) => setStyling('fontSizeTitle', v)} />
          <SizeSlider label="Body text" value={styling.fontSizeBody} min={10} max={18}
            onChange={(v) => setStyling('fontSizeBody', v)} />
          <SizeSlider label="Photo size" value={styling.photoSizeUS} min={60} max={180}
            onChange={(v) => setStyling('photoSizeUS', v)} />
        </>
      ) : (
        <>
          <SizeSlider label="Sidebar text" value={styling.fontSizeSidebar} min={10} max={16}
            onChange={(v) => setStyling('fontSizeSidebar', v)} />
          <SizeSlider label="Section titles" value={styling.fontSizeTitle} min={9} max={18}
            onChange={(v) => setStyling('fontSizeTitle', v)} />
          <SizeSlider label="Body text" value={styling.fontSizeBody} min={10} max={18}
            onChange={(v) => setStyling('fontSizeBody', v)} />
          <SizeSlider label="Photo size" value={styling.photoSizeClassic} min={60} max={200}
            onChange={(v) => setStyling('photoSizeClassic', v)} />
        </>
      )}

      <div className="sd-divider" />
      <h3 className="sd-section-title">Spacing</h3>

      {layoutId === 'us-single' ? (
        <>
          <SpacingSlider label="Header spacing" value={styling.lineHeightUSHeader}
            onChange={(v) => setStyling('lineHeightUSHeader', v)} />
          <SpacingSlider label="Body spacing" value={styling.lineHeightBody}
            onChange={(v) => setStyling('lineHeightBody', v)} />
        </>
      ) : (
        <>
          <SpacingSlider label="Sidebar spacing" value={styling.lineHeightSidebar}
            onChange={(v) => setStyling('lineHeightSidebar', v)} />
          <SpacingSlider label="Body spacing" value={styling.lineHeightBody}
            onChange={(v) => setStyling('lineHeightBody', v)} />
        </>
      )}

      {layoutId === 'us-single' && (
        <>
          <div className="sd-divider" />
          <h3 className="sd-section-title">Options</h3>
          <BoolRow label="Contact icons" value={styling.showContactIcons}
            onChange={(v) => setStyling('showContactIcons', v)} />
        </>
      )}
    </div>
  );
}
