import sensorTableStyles from '../styles/SensorTable.module.css'


const RowsData = (data) => {
    return (
        data.map((row,i) => 
            <tr key={i}>
                <td>{row.time}</td>
                <td>{row.n}</td>
                <td>{row.e}</td>
                <td>{row.s}</td>
                <td>{row.w}</td>
            </tr>
        )
    )
}

const SensorTable = ({data}) => {
    return (
        <div>
            <table className={sensorTableStyles.paleBlueRows}>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>North</th>
                        <th>East</th>
                        <th>South</th>
                        <th>West</th>
                    </tr>
                </thead>
                <tbody>
                    {RowsData(data)}
                </tbody>
            </table>
            
        </div>
    )
}

export default SensorTable
