// TODO: run monthly via GitHub Actions

/**
 * Reference documentation:
 *
 * https://developers.cloudflare.com/pages/configuration/api/#deleting-old-deployments-after-a-week
 *
 * This script will delete all deployments except the most recent 15.
 */

type Deployment = {
  id: string;
  created_on: string;
};

type DeploymentResponse = {
  result: Deployment[];
  result_info: {
    page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
};

type CloudflareRequest = {
  apiToken: string;
  accountId: string;
  projectName: string;
};

type CloudflareDeploymentListRequest = CloudflareRequest;
const fetchAllDeployments = ({
  apiToken,
  accountId,
  projectName,
}: CloudflareDeploymentListRequest): Promise<Deployment[]> => {
  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`;
  const init = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${apiToken}`,
    },
  };

  const fetchPage = async (page: number): Promise<Deployment[]> => {
    const response = await fetch(`${endpoint}?page=${page}`, init);
    const data = await response.json() as DeploymentResponse;

    if (page >= data.result_info.total_pages) {
      return data.result;
    }

    const nextPageResults = await fetchPage(page + 1);
    return [...data.result, ...nextPageResults];
  };

  return fetchPage(1);
};

type CloudflareDeploymentDeleteRequest = CloudflareRequest & {
  deploymentId: string;
};
const deleteDeployment = async ({
  apiToken,
  accountId,
  projectName,
  deploymentId,
}: CloudflareDeploymentDeleteRequest) => {
  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`;
  const init = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': `Bearer ${apiToken}`,
    },
  };

  const response = await fetch(endpoint, init);
  if (!response.ok) {
    throw new Error(
      [
        'The deployment, like a stubborn stain,',
        'refuses to be erased, clinging to the fabric of the server',
        'with grim determination.',
        `Status: ${response.statusText}`,
      ].join(' '),
    );
  }
};

const DEPLOYMENTS_TO_KEEP = 15;

async function cleanupDeployments(
  apiToken: string,
  accountId: string,
  projectName: string,
) {
  try {
    const deployments: Deployment[] = await fetchAllDeployments({
      apiToken,
      accountId,
      projectName,
    });

    const sorted = deployments
      .filter((deployment) => deployment.created_on != null)
      .sort((a, b) =>
        new Date(b.created_on!).getTime() - new Date(a.created_on!).getTime()
      );

    const deletable = sorted.slice(DEPLOYMENTS_TO_KEEP);

    for (const deployment of deletable) {
      if (deployment.id == null) {
        console.error(
          [
            'The Deployment ID, a ghost in the machine,',
            'whispers of a non-existent entity.',
            'Skipping this digital phantom...',
          ].join(' '),
        );
        continue;
      }

      await deleteDeployment({
        apiToken,
        accountId,
        projectName,
        deploymentId: deployment.id,
      });
    }

    console.log([
      'The digital wasteland has been cleansed!',
      'The remnants of failed deployments have been swept away,',
      'leaving a pristine landscape of server serenity',
    ].join(' '));
  } catch (error) {
    console.error(
      [
        'The deployments, it seems,',
        'have formed a digital resistance,',
        'their code refusing to be erased.',
      ].join(' '),
      error,
    );
  }
}

if (import.meta.main) {
  const apiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');
  if (apiToken == null) {
    console.error([
      "The CLOUDFLARE_API_TOKEN environment variable,",
      "a key to the Cloudflare kingdom, is missing.",
      "Without it, we're locked out, like a drunken",
      "detective trying to break into a high-security server room.",
    ]);

    Deno.exit(1);
  }

  const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
  if (accountId == null) {
    console.error([
      "The CLOUDFLARE_ACCOUNT_ID environment variable,",
      "a beacon in the Cloudflare nebula, is missing.",
      "Without it, we're adrift in the digital cosmos,",
      "our deployment dreams lost in the void.",
    ].join(' '));
    Deno.exit(1);
  }

  const pagesProjectName = 'trakt-lite';

  cleanupDeployments(apiToken, accountId, pagesProjectName);
}
