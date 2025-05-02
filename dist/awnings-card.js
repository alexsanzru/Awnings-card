/**
 * Awnings-card v1.0.0
 * https://github.com/alexsanzru/awnings-card
 */
function awningStatusText(pos) {
  return (pos <= 50) ? 'Collapsed' : 'Expanded';
}

class ShutterCard extends HTMLElement {
  set hass(hass) {
    const _this = this;
    const entities = this.config.entities;

    // --- INIT CARD ---
    if (!this.card) {
      const card = document.createElement('ha-card');
      if (this.config.title) card.header = this.config.title;

      this.card = card;
      this.appendChild(card);

      const allShutters = document.createElement('div');
      allShutters.className = 'sc-shutters';

      entities.forEach(function(entityConfig) {
        const entityId = entityConfig.entity || entityConfig;
        const shutter = document.createElement('div');
        shutter.className = 'sc-shutter';
        shutter.dataset.shutter = entityId;

        // HTML-шаблон
        shutter.innerHTML = `
          <div class="sc-shutter-top">
            <div class="sc-shutter-label"></div>
            <div class="sc-shutter-position"></div>
          </div>
          <div class="sc-shutter-middle">
            <div class="sc-shutter-selector">
              <div class="sc-shutter-selector-picture" style="width:153px">
                <!-- фон зададим динамически -->
              </div>
            </div>
          </div>
          <div class="sc-shutter-bottom">
            <div class="sc-shutter-label"></div>
            <div class="sc-shutter-position"></div>
          </div>
        `;

        allShutters.appendChild(shutter);
      });

      // Minimalist style
      const style = document.createElement('style');
      style.textContent = `
        .sc-shutters { padding: 16px; }
        .sc-shutter { margin-bottom: 16px; }
        .sc-shutter-label { font-size: 1rem; text-align: center; }
        .sc-shutter-position { font-weight: bold; }
        .sc-shutter-middle { display: flex; justify-content: center; }
        .sc-shutter-selector-picture {
          height: 150px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      `;
      this.card.appendChild(allShutters);
      this.appendChild(style);
    }

    // --- UPDATE UI ---
    entities.forEach(function(entityConfig) {
      const entityId = entityConfig.entity || entityConfig;
      const stateObj  = hass.states[entityId];
      const pos       = stateObj?.attributes.current_position || 0;
      const statusTxt = awningStatusText(pos);

      const shutter = _this.card.querySelector(`.sc-shutter[data-shutter="${entityId}"]`);
      if (!shutter) return;

      // Title update
      shutter.querySelectorAll('.sc-shutter-label').forEach(el => {
        el.textContent = stateObj?.attributes.friendly_name || entityId;
      });
      // State update
      shutter.querySelectorAll('.sc-shutter-position').forEach(el => {
        el.textContent = statusTxt;
      });
      // Background image
      const pic = shutter.querySelector('.sc-shutter-selector-picture');
      const imgUrl = (pos <= 50)
        ? '/local/awnings-card/images/sc_shutter_open.png'
        : '/local/awnings-card/images/sc_shutter.png';
      pic.style.backgroundImage = `url('${imgUrl}')`;
    });
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }
}

customElements.define('awnings-card', ShutterCard);
