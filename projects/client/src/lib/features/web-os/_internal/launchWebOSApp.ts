import { error as printError } from '$lib/utils/console/print.ts';

const WEB_OS_APPLICATION_MANAGER_URL = 'luna://com.webos.applicationManager';

type WebOSLaunchParams = {
  id: string;
  contentTarget: string;
};

export function launchWebOSApp(source: string, params: WebOSLaunchParams) {
  webOS?.service.request(WEB_OS_APPLICATION_MANAGER_URL, {
    method: 'launch',
    parameters: {
      id: params.id,
      params: {
        contentTarget: params.contentTarget,
      },
    },
    onFailure(error) {
      if (error.errorCode === -101) {
        // FIXME: use something else for alerts and prompts
        // skipcq: JS-0052
        alert(`${source} is not installed on your device.`);
        return;
      }

      printError(`[${error.errorCode}]: ${error.errorText}`);
    },
  });
}
