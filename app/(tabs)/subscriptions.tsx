import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Text as RNText, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  // Calculate upcoming subscriptions (same logic as Home tab)
  const upcomingSubscriptions = useMemo(() => {
    const now = dayjs();
    const nextWeek = now.add(7, "days");
    return subscriptions
      .filter(
        (sub) =>
          sub.status === "active" &&
          dayjs(sub.renewalDate).isAfter(now) &&
          dayjs(sub.renewalDate).isBefore(nextWeek),
      )
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        price: sub.price,
        icon: sub.icon,
        currency: sub.currency ?? "USD",
        daysLeft: dayjs(sub.renewalDate).diff(now, "day"),
      }))
      .sort((a, b) =>
        dayjs(subscriptions.find((s) => s.id === a.id)?.renewalDate).diff(
          dayjs(subscriptions.find((s) => s.id === b.id)?.renewalDate),
        ),
      );
  }, [subscriptions]);

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View className="px-5 pt-5">
              <RNText className="text-3xl font-bold text-dark mb-5">
                Subscriptions
              </RNText>
              <TextInput
                className="bg-card rounded-xl px-4 py-3 text-dark mb-4"
                placeholder="Search subscriptions..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View className="mb-5 px-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    daysLeft={item.daysLeft}
                    icon={item.icon}
                    currency={item.currency}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <RNText className="home-empty-state">
                    No upcoming renewals yet.
                  </RNText>
                }
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        )}
        contentContainerClassName="pb-30"
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};
export default Subscriptions;
