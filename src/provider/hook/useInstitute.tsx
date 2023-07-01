import { usePermissions } from 'react-admin';

const useInstitute = () => {
    const { isLoading, permissions } = usePermissions();
    if (isLoading) return null;
    return permissions['institute'];
};

export default useInstitute;
