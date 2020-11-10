import Identicon from 'identicon.js'

export const addDefaultSrc = (ev, address) => {
  ev.target.src = `data:image/svg+xml;base64,${new Identicon(address, { format: 'svg' }).toString()}`
}
