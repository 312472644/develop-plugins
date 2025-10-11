/**
 * Flip 改变元素的DOM结构，实现元素的动画效果
 * @param {Array<HTMLElement>} eleList 需要执行动画的元素列表
 * @param {Object} config 动画配置
 * @param {Number} [config.duration=0.5] 动画时长(s)
 * @param {String} [config.easing='cubic-bezier(0.42, 0, 0.58, 1)'] 动画曲线
 * @param {String} [config.fill='forwards'] 动画填充
 * @example
 * const flip = new Flip();
 * flip.play();
 */
class Flip {
  #now = new Date().getTime();
  #positionMap;
  #isPlaying = false;
  #config = {
    duration: 0.5,
    fill: "forwards",
    easing: "cubic-bezier(0.42, 0, 0.58, 1)",
  };

  /**
   * @constructor
   * @param {Array<HTMLElement>} eleList 需要执行动画的元素列表
   * @param {Object} config 动画配置
   * @param {Number} config.duration 动画时长
   * @param {String} config.easing 动画曲线
   * @param {String} config.fill 动画填充
   */
  constructor(eleList = [], config = {}) {
    if (!Array.isArray(Array.from(eleList)) || eleList.length === 0) {
      throw new Error("参数错误");
    }
    this.eleList = [...eleList];
    // 每个元素的初始位置
    this.#positionMap = new WeakMap();
    this.#config = Object.assign(this.#config, config);
    this.#init();
  }

  #init() {
    this.eleList.forEach((item) => {
      const { x, y } = item.getBoundingClientRect();
      this.#positionMap.set(item, [x, y]);
    });
  }

  // 防止多次触发
  #preventMultipleCLick() {
    return new Date().getTime() - this.#now < 500;
  }

  play() {
    const flag = this.#preventMultipleCLick();
    if (flag) return;
    this.#now = new Date().getTime();
    for (let i = 0; i < this.eleList.length; i++) {
      const item = this.eleList[i];
      const position = this.#positionMap.get(item);
      if (!position) return;
      const [startX = 0, startY = 0] = position;
      const { x: endX, y: endY } = item.getBoundingClientRect();
      this.#positionMap.set(item, [endX, endY]);

      if (startX !== endX || (startY !== endY && !this.#isPlaying)) {
        this.#isPlaying = true;
        item.animate(
          [
            {
              transform: `translate(${startX - endX}px, ${startY - endY}px)`,
              easing: "cubic-bezier(0.42, 0, 0.58, 1)",
            },
            { transform: "translate(0, 0)", easing: this.#config.easing },
          ],
          {
            duration: this.#config.duration * 1000,
            fill: this.#config.fill,
          }
        ).onfinish = () => {
          this.#isPlaying = false;
        };
      }
    }
  }
}
