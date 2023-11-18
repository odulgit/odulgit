import { getConfig } from "../service/config"

export const sendNotify = async (address: string, type: string, title: string, body: string, icon: string | undefined = undefined, url: string | undefined = undefined) => {
  const payload: any = {
    notification: {
      type,
      title,
      body,
    },
    accounts: [
      `eip155:${getConfig().ethereum?.chainId}:${address}`,
    ],
  }
  if (icon) {
    payload.notification.icon = icon
  }
  if (icon) {
    payload.notification.url = url
  }

  const response = await fetch(
    `https://notify.walletconnect.com/${getConfig().walletConnect?.projectId}/notify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getConfig().walletConnect?.notifySecret}`,
      },
      body: JSON.stringify(payload),
    },
  )

  return await response.text()
}
