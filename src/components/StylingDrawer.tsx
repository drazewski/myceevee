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

export default function StylingDrawer() {
  const { styling, setStyling } = useSettingsStore();

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

      <SizeSlider label="Sidebar text" value={styling.fontSizeSidebar} min={10} max={16}
        onChange={(v) => setStyling('fontSizeSidebar', v)} />

      <SizeSlider label="Chapter titles" value={styling.fontSizeTitle} min={9} max={18}
        onChange={(v) => setStyling('fontSizeTitle', v)} />

      <SizeSlider label="Body text" value={styling.fontSizeBody} min={10} max={18}
        onChange={(v) => setStyling('fontSizeBody', v)} />

      <div className="sd-divider" />
      <h3 className="sd-section-title">Spacing</h3>

      <Row label="Sidebar spacing">
        <div className="sd-slider-group">
          <input
            type="range" min={1.2} max={2.0} step={0.05} value={styling.lineHeightSidebar}
            onChange={(e) => setStyling('lineHeightSidebar', Number(e.target.value))}
            className="sd-slider"
          />
          <span className="sd-slider__value">{styling.lineHeightSidebar.toFixed(2)}</span>
        </div>
      </Row>

      <Row label="Body spacing">
        <div className="sd-slider-group">
          <input
            type="range" min={1.2} max={2.0} step={0.05} value={styling.lineHeightBody}
            onChange={(e) => setStyling('lineHeightBody', Number(e.target.value))}
            className="sd-slider"
          />
          <span className="sd-slider__value">{styling.lineHeightBody.toFixed(2)}</span>
        </div>
      </Row>
    </div>
  );
}
