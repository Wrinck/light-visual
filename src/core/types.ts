// src/core/types.ts

/** Базовая конфигурация симуляции (IConfig) */
export interface IConfig {
  /** Длина волны (нм) */
  wavelength: number;
  /** Параметры расчётной сетки */
  grid: {
    width: number; // px
    height: number; // px
    sizeX: number; // физические метры по X
    sizeY: number; // физические метры по Y
  };
  /** Расстояние до экрана наблюдателя (м) */
  observerDistance: number;
  /** Шаг по времени для анимации (опционально) */
  timeStep?: number;
}

/** Данные оптического поля (FieldData) */
export interface FieldData {
  /** Интенсивность в диапазоне [0, 1]. Длина: width * height */
  intensity: Float32Array;
  /** Фаза в диапазоне [0, 2π]. Длина: width * height */
  phase: Float32Array;
  /**
   * Комплексная амплитуда. Хранится в чередующемся виде: [re₀, im₀, re₁, im₁, ...]
   * Длина: width * height * 2. Оптимизировано для FFT и GPU-шейдеров.
   */
  amplitude: Float32Array;

  metadata: {
    maxIntensity: number;
    timestamp: number;
    /** Снимок конфигурации, по которой было рассчитано поле */
    config: IConfig;
  };
}

/**
 * Контракт физического модуля (ISimulation)
 * TConfig расширяет базовый конфиг специфичными параметрами явления
 */
export interface ISimulation<TConfig extends IConfig = IConfig> {
  readonly id: string;
  readonly name: string;

  /** Валидация входных параметров перед расчётом */
  validate(config: Partial<TConfig>): config is TConfig;

  /**
   * Асинхронный расчёт поля.
   * Возвращает Promise для выноса в Web Worker без блокировки UI.
   */
  calculate(config: TConfig, time?: number): Promise<FieldData>;

  /** Очистка буферов, таймеров и внешних ресурсов */
  dispose(): void;
}

/**
 * Контракт рендерера (IRenderer)
 * Реализуется для Canvas 2D, WebGL 2, WebGPU
 */
export interface IRenderer {
  /** Привязка к DOM-элементу и инициализация контекста */
  attach(canvas: HTMLCanvasElement): void;

  /**
   * Отрисовка поля.
   * Должна принимать только необходимые данные, чтобы избежать копирования в GPU.
   */
  render(field: FieldData, options?: RenderOptions): void;

  /** Адаптация под новый размер контейнера */
  resize(width: number, height: number): void;

  /** Очистка GPU/CPU ресурсов */
  dispose(): void;
}

export interface RenderOptions {
  /** Режим колоризации */
  colorMode: 'monochrome' | 'spectrum' | 'thermal' | 'scientific';
  /** Гамма-коррекция (по умолчанию 2.2) */
  gamma: number;
  /** Масштабирование интенсивности */
  intensityScale: 'linear' | 'logarithmic' | 'auto';
}
