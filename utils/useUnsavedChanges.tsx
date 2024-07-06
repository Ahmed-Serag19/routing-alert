import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useUnsavedChanges = (unsavedChanges: boolean) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (unsavedChanges) {
        const confirmationMessage =
          'You didn’t save your work yet! Are you sure you want to close the page without saving?';
        const confirmation = confirm(confirmationMessage);
        if (!confirmation) {
          router.refresh();
          throw 'Route change aborted';
        }
      }
    };

    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = async (...args) => {
      try {
        await handleRouteChange(args[0] as string);
      } catch (error) {
        return;
      }
      return originalPush(...args);
    };

    router.replace = async (...args) => {
      try {
        await handleRouteChange(args[0] as string);
      } catch (error) {
        return;
      }
      return originalReplace(...args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [unsavedChanges, router]);

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      e.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () =>
      window.removeEventListener('beforeunload', handleWindowClose);
  }, [unsavedChanges]);
};

export default useUnsavedChanges;
