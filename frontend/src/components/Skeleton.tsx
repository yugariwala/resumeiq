export default function Skeleton({
    className = '',
    width,
    height,
}: {
    className?: string
    width?: string | number
    height?: string | number
}) {
    return (
        <div
            className={`bg-[#161B22] rounded-lg overflow-hidden ${className}`}
            style={{ width, height }}
        >
            <div className="w-full h-full animate-shimmer" />
        </div>
    )
}
