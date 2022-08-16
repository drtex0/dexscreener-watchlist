import { Textarea, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect } from 'react';
import { z, ZodError } from 'zod';
import { watchListSchema } from '../../../lib/dexscreener/watchlist.dto';

interface WatchlistFormProps {
  handleFormSubmit: (value: z.infer<typeof watchListSchema>) => void;
}

export const WatchlistForm = ({ handleFormSubmit }: WatchlistFormProps) => {
  const [watchList, setWatchList] = useLocalStorage<string>({
    key: 'watchlist',
  });

  const form = useForm({
    initialValues: {
      watchList: '',
    },
    validate: {
      watchList: (value) => {
        try {
          watchListSchema.parse(JSON.parse(value));

          return null;
        } catch (err) {
          if (err instanceof ZodError) {
            return 'Incorrect JSON format';
          }

          if (err instanceof SyntaxError) {
            return 'Unable to parse JSON input';
          }

          return 'Unknown error';
        }
      },
    },
  });

  const handleOnSubmitForm = form.onSubmit((value) => {
    const data = watchListSchema.parse(JSON.parse(value.watchList));
    setWatchList(value.watchList);

    handleFormSubmit(data);
  });

  useEffect(() => {
    if (watchList && watchList.length > 0) {
      form.setFieldValue('watchList', watchList);
    }
  }, [watchList]);

  return (
    <form onSubmit={handleOnSubmitForm}>
      <Textarea
        placeholder="Paste your watchlist here"
        label="Your watchlist"
        size="lg"
        radius="md"
        value={watchList}
        required
        {...form.getInputProps('watchList')}
      />

      <Button type="submit" color="cyan" radius="md" size="lg">
        Load
      </Button>
    </form>
  );
};
