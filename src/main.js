const storageKey = 'request_history'

const init = () => {
  const history = JSON.parse(window.localStorage.getItem(storageKey))

  if (!history || history.length === 0) return

  const serviceEl = document.getElementById('service')
  const environmentEl = document.getElementById('environment')
  const fnEl = document.getElementById('function-name')
  const dataEl = document.getElementById('data')


  serviceEl.value = history[0].service
  environmentEl.value = history[0].environment
  fnEl.value = history[0].fn
  dataEl.value = history[0].data
}

const updateScroll = (id) => {
  const element = document.getElementById(id);
  element.scrollTop = element.scrollHeight;
}

const writeResult = (result, isError) => {
  const row = document.createElement('div')
  row.className = 'row'
  const code = document.createElement('pre')
  if (isError) code.className = 'error'
  code.innerText = JSON.stringify(result)
  row.appendChild(code)
  document.getElementById('result').appendChild(row)
  updateScroll("result-container")
}

const handleSubmit = (e) => {
  e.preventDefault()

  const requestParams = {
    service: document.getElementById('service').value,
    fn: document.getElementById('function-name').value,
    environment: document.getElementById('environment').value,
    data: document.getElementById('data').value
  }

  const history = window.localStorage.getItem(storageKey) || []
  const updatedHistory = [requestParams, ...history.slice(0, 5)]

  window.localStorage.setItem(storageKey, JSON.stringify(updatedHistory))

  window.api.send('rpcRequest', requestParams)
  return false
}

window.api.receive('rpcResponse', data => writeResult(data))
window.api.receive('rpcError', data => writeResult(data, true))
init()