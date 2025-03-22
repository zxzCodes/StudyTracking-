import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
type DashboardCardProps = {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    value: string;
    description: string;
    };

export default function DashboardCard({ title, icon: Icon, value, description }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-6 h-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
