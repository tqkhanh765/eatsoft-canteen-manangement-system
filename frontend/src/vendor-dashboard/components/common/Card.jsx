export default function Card({ title, value, icon }) {
    return (
        <div className="card card-hover">
            <div className="card-top">
                <span>{icon}</span>
                <h4>{title}</h4>
            </div>
            <h2>{value}</h2>
        </div>
    );
}