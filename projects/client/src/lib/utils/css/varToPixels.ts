import { browser } from '$app/environment';

export function varToPixels(variable: string) {
  if (!browser) return 0;

  const rootStyle = getComputedStyle(document.documentElement);
  const variableValue = rootStyle.getPropertyValue(variable);
  const pixelMeasurementDiv = document.createElement('div');
  pixelMeasurementDiv.style.visibility = 'hidden';
  pixelMeasurementDiv.style.pointerEvents = 'none';
  pixelMeasurementDiv.style.width = variableValue;

  document.body.appendChild(pixelMeasurementDiv);
  const pixelValue = pixelMeasurementDiv.getBoundingClientRect().width;
  document.body.removeChild(pixelMeasurementDiv);

  return pixelValue;
}
