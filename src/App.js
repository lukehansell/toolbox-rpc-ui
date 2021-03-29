// App.js
import React, { useState } from "react"

const parseData = (rawData) => {
  try {
    return {
      data: JSON.parse(rawData),
      err: null
    }
  } catch (err) {
    return {
      data: null,
      err
    }
  }
}

const App = () => {

  const environments = ['development', 'staging', 'production']

  const [serviceName, setServiceName] = useState('')
  const [environment, setEnvironment] = useState('development')
  const [functionName, setFunctionName] = useState('')
  const [rawData, setRawData] = useState()

  const handleServiceNameChange = ({ target: { value }}) => {
    setServiceName(value)
  }

  const handleEnvironmentChange = ({ target: { value }}) => {
    if (environments.indexOf(value) === -1) return
    setEnvironment(value)
  }

  const handleFunctionNameChange = ({ target: { value }}) => {
    setFunctionName(value)
  }

  const handleDataChange = ({ target: { value }}) => {
    setRawData(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    window.api.send('toMain', {
      service: serviceName,
      functionName,
      environment,
      data: rawData
    })
  }

  const {
    data,
    err: parseErr
  } = parseData(rawData)

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label>
          Service Name
          <input name="service-name" value={serviceName} onChange={handleServiceNameChange} />
        </label>
        <br />
        <label>Environment
          <select onChange={handleEnvironmentChange}>
            {environments.map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Function
          <input name="service-name" value={functionName} onChange={handleFunctionNameChange} />
        </label>
        <br />
        <label>
          Data
          <textarea value={rawData} onChange={handleDataChange}/>
        </label>
        <br />
        <input type="submit" />
      </form>
      <hr />
      Result:
      <br />
      <code>dockyard-rpc {serviceName && `-s '${serviceName}'`} -e '{environment}' -f '{functionName}' {data && `-d '${rawData}'`}</code>
    </React.Fragment>
  )
}

export default App