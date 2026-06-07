export default function StatCard({title, value, color}){
    return(
        <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-slate-500">{title}</p>
            <h2 className={`text-3xl font-bold ${color}`}>
            {value}
            </h2>
        </div>
    )
}