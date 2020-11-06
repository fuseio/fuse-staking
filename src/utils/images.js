import Identicon from 'identicon.js'

export const addDefaultSrc = (ev, address) => {
  ev.target.src = `data:image/png;base64,${new Identicon(address).toString()}`
}
