import {DashboardLayout} from '@/components/layout/DashboardLayout';
import {UsersWithProfilesTable} from "@/components/person/UsersWithProfilesTable";

export default function UsersWithProfilesPage() {
    return (
        <DashboardLayout>
            <UsersWithProfilesTable/>
        </DashboardLayout>
    );
}